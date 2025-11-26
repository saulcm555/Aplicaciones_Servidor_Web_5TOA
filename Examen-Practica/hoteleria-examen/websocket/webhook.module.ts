import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { NotificacionesGateway } from './websocket.gateway';

/**
 * Módulo de Webhooks y WebSocket
 * - Integra el WebSocket Gateway
 * - Proporciona el servicio de webhooks
 * - Expone el controlador de webhooks
 */
@Module({
  controllers: [WebhookController],
  providers: [WebhookService, NotificacionesGateway],
  exports: [WebhookService, NotificacionesGateway],
})
export class WebhookModule {}
