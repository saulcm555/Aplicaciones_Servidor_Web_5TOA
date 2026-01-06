import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

/**
 * Interceptor que captura automáticamente POST, PUT, PATCH en los controladores REST
 * y envía notificaciones al webhook interno
 * 
 * Se aplica globalmente o por módulo para no modificar los controladores existentes
 */
@Injectable()
export class WebhookNotificationInterceptor implements NestInterceptor {
  private logger: Logger = new Logger('WebhookNotificationInterceptor');
  private readonly WEBHOOK_URL = 'http://localhost:3000/webhook/notificacion';

  constructor(private readonly httpService: HttpService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    // Solo interceptar POST, PUT, PATCH (operaciones de modificación)
    if (!['POST', 'PUT', 'PATCH'].includes(method)) {
      return next.handle();
    }

    // Excluir el propio endpoint de webhook para evitar recursión
    if (url.includes('/webhook/')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (responseData) => {
        try {
          // Extraer información de la operación
          const notificacion = this.construirNotificacion(
            request,
            responseData,
            method,
            url,
          );

          // Enviar notificación al webhook de forma asíncrona
          await this.enviarNotificacionWebhook(notificacion);
        } catch (error) {
          this.logger.error(
            `Error al enviar notificación al webhook: ${error.message}`,
          );
        }
      }),
    );
  }

  /**
   * Construye el objeto de notificación a partir de la request y response
   */
  private construirNotificacion(
    request: any,
    responseData: any,
    method: string,
    url: string,
  ): any {
    // Detectar tipo de operación
    let tipo_operacion = 'update';
    if (method === 'POST') {
      tipo_operacion = 'create';
    } else if (url.includes('/confirmar')) {
      tipo_operacion = 'confirmar';
    } else if (url.includes('/cancelar')) {
      tipo_operacion = 'cancelar';
    }

    // Extraer nombre de la entidad de la URL
    const entidad = this.extraerEntidadDeURL(url);

    // Extraer ID del recurso (de la response o de la URL)
    const id = responseData?.id || this.extraerIdDeURL(url);

    return {
      tipo_operacion,
      entidad,
      id,
      datos: responseData,
      mensaje: this.generarMensaje(tipo_operacion, entidad, id),
    };
  }

  /**
   * Extrae el nombre de la entidad de la URL
   */
  private extraerEntidadDeURL(url: string): string {
    // Ejemplos: /categorias-destinos, /destinos/1, /hoteles/1/habitaciones
    const segments = url.split('/').filter((s) => s.length > 0);

    // El primer segmento suele ser la entidad
    if (segments.length > 0) {
      return segments[0];
    }

    return 'desconocido';
  }

  /**
   * Extrae el ID de la URL si está presente
   */
  private extraerIdDeURL(url: string): number | undefined {
    // Buscar números en los segmentos de la URL
    const segments = url.split('/');
    for (const segment of segments) {
      const num = parseInt(segment, 10);
      if (!isNaN(num)) {
        return num;
      }
    }
    return undefined;
  }

  /**
   * Genera un mensaje descriptivo
   */
  private generarMensaje(
    tipo_operacion: string,
    entidad: string,
    id?: number,
  ): string {
    const operaciones = {
      create: 'creado',
      update: 'actualizado',
      confirmar: 'confirmado',
      cancelar: 'cancelado',
    };

    const textoOperacion = operaciones[tipo_operacion] || tipo_operacion;
    return `${entidad} ${id ? `#${id}` : ''} ${textoOperacion}`;
  }

  /**
   * Envía la notificación al webhook interno
   */
  private async enviarNotificacionWebhook(notificacion: any): Promise<void> {
    try {
      this.logger.log(
        `Enviando notificación al webhook: ${notificacion.tipo_operacion} ${notificacion.entidad}`,
      );

      const response = await firstValueFrom(
        this.httpService.post(this.WEBHOOK_URL, notificacion, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000, // Timeout de 5 segundos
        }),
      );

      this.logger.debug(
        `Notificación enviada exitosamente al webhook: ${response?.status || 'OK'}`,
      );
    } catch (error: any) {
      // No lanzar error para no afectar la operación principal
      this.logger.warn(
        `No se pudo enviar notificación al webhook: ${error?.message || 'Error desconocido'}`,
      );
    }
  }
}
