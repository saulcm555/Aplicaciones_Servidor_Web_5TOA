import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { WebhookService } from './webhook.service';

/**
 * Consumidor RAW de RabbitMQ para eventos del Topic Exchange
 * Bypass NestJS @EventPattern que requiere metadata especial
 */
@Injectable()
export class RawRabbitConsumer implements OnModuleInit {
  private readonly logger = new Logger(RawRabbitConsumer.name);
  private channel: amqp.Channel | null = null;

  constructor(
    private configService: ConfigService,
    private webhookService: WebhookService,
  ) {}

  async onModuleInit() {
    try {
      const rabbitURL = this.configService.get('RABBITMQ_URL') || 
        'amqp://guest:guest@microservices_rabbitmq:5672';

      this.logger.log(`Connecting to RabbitMQ: ${rabbitURL}`);
      const conn = await amqp.connect(rabbitURL);
      this.channel = await conn.createChannel();

      const queue = 'webhook_publisher_queue';
      
      this.logger.log(`✅ Connected! Consuming from queue: ${queue}`);

      // Consumir mensajes de la cola
      await this.channel.consume(
        queue,
        async (msg) => {
          if (!msg) return;

          try {
            const content = msg.content.toString();
            const data = JSON.parse(content);
            const routingKey = msg.fields.routingKey;

            this.logger.log(`📥 Received message: ${routingKey}`);
            this.logger.debug(`Data: ${content}`);

            // Procesar según routing key
            await this.webhookService.processEvent(routingKey, data);

            // ACK manual
            this.channel!.ack(msg);
            this.logger.log(`✅ Processed: ${routingKey}`);
          } catch (error) {
            this.logger.error(`❌ Error processing message: ${error.message}`);
            // NACK y requeue
            this.channel!.nack(msg, false, true);
          }
        },
        { noAck: false }
      );

      this.logger.log(`📬 Listening for events on queue: ${queue}`);
    } catch (error) {
      this.logger.error(`Failed to connect to RabbitMQ: ${error.message}`);
    }
  }
}
