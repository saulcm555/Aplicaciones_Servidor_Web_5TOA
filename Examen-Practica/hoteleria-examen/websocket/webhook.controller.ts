import { Controller, Post, Body, Get } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookNotificationDto } from './dto/webhook-notification.dto';

/**
 * Controlador Webhook que actúa como intermediario entre REST y WebSocket
 * - Endpoint POST /webhook/notificacion - Recibe notificaciones del REST
 * - Endpoint GET /webhook/estadisticas - Obtiene estadísticas del servicio
 */
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  /**
   * Endpoint que recibe notificaciones del REST
   * POST /webhook/notificacion
   * 
   * Body ejemplo:
   * {
   *   "tipo_operacion": "create",
   *   "entidad": "hoteles",
   *   "id": 1,
   *   "datos": { "nombre": "Hotel Plaza", ... },
   *   "mensaje": "Hotel creado exitosamente"
   * }
   */
  @Post('notificacion')
  async recibirNotificacion(@Body() notificacion: WebhookNotificationDto) {
    return await this.webhookService.procesarNotificacion(notificacion);
  }

  /**
   * Endpoint para obtener estadísticas del servicio webhook
   * GET /webhook/estadisticas
   */
  @Get('estadisticas')
  getEstadisticas() {
    return this.webhookService.getEstadisticas();
  }

  /**
   * Endpoint de health check
   * GET /webhook/health
   */
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      servicio: 'webhook',
      timestamp: new Date().toISOString(),
      mensaje: 'Servicio webhook funcionando correctamente',
    };
  }

  /**
   * Endpoint para probar el flujo completo desde POSTMAN
   * Envía una notificación de prueba y retorna el resultado
   * GET /webhook/test
   */
  @Get('test')
  async testWebhook() {
    const notificacionPrueba = {
      tipo_operacion: 'create',
      entidad: 'test-postman',
      id: 999,
      datos: {
        mensaje: 'Prueba automática del sistema',
        timestamp: new Date().toISOString(),
      },
      mensaje: 'Notificación de prueba generada desde GET /webhook/test',
    };

    const resultado = await this.webhookService.procesarNotificacion(notificacionPrueba);

    return {
      success: true,
      mensaje: '✅ Flujo completo ejecutado exitosamente',
      flujo: [
        '1. Request recibido en GET /webhook/test',
        '2. Notificación creada automáticamente',
        '3. Webhook procesó la notificación',
        '4. WebSocket Gateway emitió el evento',
        '5. Clientes conectados notificados',
      ],
      resultado,
      instrucciones: {
        verificar_logs: 'Revisa los logs del servidor para ver el flujo completo',
        conectar_websocket: 'Usa ws://localhost:3001/socket.io/?EIO=4&transport=websocket en POSTMAN',
        probar_rest: 'Ejecuta POST a cualquier entidad (categorias-destinos, hoteles, etc.)',
      },
    };
  }
}
