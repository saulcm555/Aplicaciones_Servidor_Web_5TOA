import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpService } from '@nestjs/axios';
import { WebhookNotificationInterceptor } from '../websocket/interceptors/webhook-notification.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Interceptor global para webhooks
  const httpService = app.get(HttpService);
  app.useGlobalInterceptors(new WebhookNotificationInterceptor(httpService));
  logger.log('✅ Interceptor de Webhooks activado globalmente');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`🚀 Servidor REST iniciado en: http://localhost:${port}`);
  logger.log(`🔌 WebSocket Gateway disponible en: http://localhost:3001`);
  logger.log(`📡 Webhook endpoint: http://localhost:${port}/webhook/notificacion`);
  logger.log(`🌐 Cliente WebSocket: Abre websocket/cliente-websocket.html en tu navegador`);
}
bootstrap();