import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('WebhookPublisher');

  // Crear aplicación HTTP (RawRabbitConsumer maneja RabbitMQ directamente)
  const app = await NestFactory.create(AppModule);

  // NO conectar microservicio NestJS - usamos RawRabbitConsumer en su lugar
  // Esto evita conflictos de consumidores y permite routing keys dinámicos

  // Iniciar servidor HTTP (para health checks)
  const port = process.env.PORT || 3003;
  await app.listen(port);

  logger.log(`🚀 Webhook Publisher Service running on port ${port}`);
  logger.log(`📡 RawRabbitConsumer handles RabbitMQ messages directly`);
  logger.log(`📬 Listening for events: all events routed to webhook_publisher_queue`);
}

bootstrap();
