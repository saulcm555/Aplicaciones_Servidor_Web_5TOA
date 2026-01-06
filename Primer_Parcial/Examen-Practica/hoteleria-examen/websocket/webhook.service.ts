import { Injectable, Logger } from '@nestjs/common';
import { NotificacionesGateway } from './websocket.gateway';
import { WebhookNotificationDto } from './dto/webhook-notification.dto';

/**
 * Servicio Webhook que actúa como intermediario entre REST y WebSocket
 * - Recibe notificaciones del REST
 * - Aplica lógica adicional si es necesario
 * - Envía las notificaciones al WebSocket Gateway
 */
@Injectable()
export class WebhookService {
  private logger: Logger = new Logger('WebhookService');

  constructor(private readonly notificacionesGateway: NotificacionesGateway) {}

  /**
   * Procesa una notificación recibida del REST
   * Aplica lógica adicional y la envía al WebSocket Gateway
   */
  async procesarNotificacion(notificacion: WebhookNotificationDto) {
    this.logger.log(`Procesando notificación de tipo: ${notificacion.tipo_operacion}`);
    this.logger.debug(`Entidad: ${notificacion.entidad}, ID: ${notificacion.id}`);

    // Aplicar lógica adicional según el tipo de operación
    const notificacionProcesada = this.aplicarLogicaAdicional(notificacion);

    // Emitir la notificación a través del WebSocket Gateway
    this.notificacionesGateway.emitirNotificacionGlobal(
      'notificacion',
      notificacionProcesada,
    );

    return {
      success: true,
      mensaje: 'Notificación procesada y enviada correctamente',
      notificacion: notificacionProcesada,
      clientesNotificados: this.notificacionesGateway.getClientesConectados(),
    };
  }

  /**
   * Aplica lógica adicional según el tipo de operación y entidad
   */
  private aplicarLogicaAdicional(notificacion: WebhookNotificationDto) {
    // Generar mensaje descriptivo si no existe
    if (!notificacion.mensaje) {
      notificacion.mensaje = this.generarMensajeDescriptivo(notificacion);
    }

    // Agregar metadatos adicionales
    const notificacionEnriquecida = {
      ...notificacion,
      metadata: {
        procesadoEn: new Date().toISOString(),
        prioridad: this.calcularPrioridad(notificacion),
        categoria: this.obtenerCategoria(notificacion.entidad),
      },
    };

    // Lógica específica por tipo de operación
    switch (notificacion.tipo_operacion) {
      case 'create':
        this.logger.log(`✅ Nuevo ${notificacion.entidad} creado con ID: ${notificacion.id}`);
        break;
      case 'update':
        this.logger.log(`✏️  ${notificacion.entidad} con ID ${notificacion.id} actualizado`);
        break;
      case 'delete':
        this.logger.log(`🗑️  ${notificacion.entidad} con ID ${notificacion.id} eliminado`);
        notificacionEnriquecida.metadata.prioridad = 'alta'; // Eliminaciones son prioridad alta
        break;
      case 'confirmar':
        this.logger.log(`✅ Reserva con ID ${notificacion.id} confirmada`);
        notificacionEnriquecida.metadata.prioridad = 'alta';
        break;
      case 'cancelar':
        this.logger.log(`❌ Reserva con ID ${notificacion.id} cancelada`);
        notificacionEnriquecida.metadata.prioridad = 'media';
        break;
    }

    return notificacionEnriquecida;
  }

  /**
   * Genera un mensaje descriptivo para la notificación
   */
  private generarMensajeDescriptivo(notificacion: WebhookNotificationDto): string {
    const { tipo_operacion, entidad, id } = notificacion;

    const operacionTexto = {
      create: 'creado',
      update: 'actualizado',
      delete: 'eliminado',
      confirmar: 'confirmado',
      cancelar: 'cancelado',
    };

    const entidadNombre = {
      'categorias-destinos': 'Categoría de Destino',
      destinos: 'Destino',
      hoteles: 'Hotel',
      habitaciones: 'Habitación',
      clientes: 'Cliente',
      reservas: 'Reserva',
    };

    const nombreEntidad = entidadNombre[entidad] || entidad;
    const textoOperacion = operacionTexto[tipo_operacion] || tipo_operacion;

    return `${nombreEntidad} ${id ? `#${id}` : ''} ${textoOperacion} exitosamente`;
  }

  /**
   * Calcula la prioridad de la notificación
   */
  private calcularPrioridad(notificacion: WebhookNotificationDto): string {
    // Reservas y clientes tienen prioridad alta
    if (['reservas', 'clientes'].includes(notificacion.entidad)) {
      return 'alta';
    }

    // Eliminaciones son prioridad alta
    if (notificacion.tipo_operacion === 'delete') {
      return 'alta';
    }

    // Creaciones son prioridad media
    if (notificacion.tipo_operacion === 'create') {
      return 'media';
    }

    // Actualizaciones son prioridad baja
    return 'baja';
  }

  /**
   * Obtiene la categoría de la entidad
   */
  private obtenerCategoria(entidad: string): string {
    const categorias = {
      'categorias-destinos': 'configuracion',
      destinos: 'contenido',
      hoteles: 'contenido',
      habitaciones: 'inventario',
      clientes: 'usuarios',
      reservas: 'transacciones',
    };

    return categorias[entidad] || 'general';
  }

  /**
   * Obtiene estadísticas del servicio webhook
   */
  getEstadisticas() {
    return {
      clientesConectados: this.notificacionesGateway.getClientesConectados(),
      webhookActivo: true,
      websocketActivo: true,
      puerto: 3001,
    };
  }
}
