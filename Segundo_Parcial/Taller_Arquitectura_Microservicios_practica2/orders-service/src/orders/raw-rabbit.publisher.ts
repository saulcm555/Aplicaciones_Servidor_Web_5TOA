import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RawRabbitPublisher implements OnModuleInit {
  private readonly logger = new Logger(RawRabbitPublisher.name);
  private channel: amqp.Channel | null = null;
  private exchange: string;

  constructor(private readonly configService: ConfigService) {
    this.exchange = this.configService.get('RABBITMQ_EXCHANGE', 'microservices.events');
  }

  async onModuleInit() {
    const rabbitURL = this.configService.get('RABBITMQ_URL', 'amqp://guest:guest@rabbitmq:5672');
    
    try {
      this.logger.log(`📡 Connecting to RabbitMQ: ${rabbitURL}`);
      const conn = await amqp.connect(rabbitURL);
      this.channel = await conn.createChannel();
      
      // Asegurar que el exchange existe
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
      
      this.logger.log(`✅ Connected to exchange: ${this.exchange}`);
    } catch (error) {
      this.logger.error(`❌ Failed to connect to RabbitMQ: ${error.message}`);
      throw error;
    }
  }

  async publish(routingKey: string, data: any): Promise<void> {
    if (!this.channel) {
      this.logger.error('❌ Cannot publish: RabbitMQ channel not initialized');
      return;
    }

    try {
      const message = Buffer.from(JSON.stringify(data));
      const published = this.channel.publish(
        this.exchange,
        routingKey,
        message,
        { persistent: true, contentType: 'application/json' }
      );

      if (published) {
        this.logger.log(`📤 Published to ${this.exchange} with routing key: ${routingKey}`);
      } else {
        this.logger.warn(`⚠️  Message buffer full for routing key: ${routingKey}`);
      }
    } catch (error) {
      this.logger.error(`❌ Failed to publish message: ${error.message}`);
      throw error;
    }
  }
}
