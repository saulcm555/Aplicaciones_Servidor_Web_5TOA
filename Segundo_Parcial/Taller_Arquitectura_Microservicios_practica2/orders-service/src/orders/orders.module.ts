import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { RawRabbitPublisher } from './raw-rabbit.publisher';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Order]),
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://microservices_rabbitmq:5672'],
          queue: 'products_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'EVENTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://microservices_rabbitmq:5672'],
          queue: 'events_publisher_temp',  // Cola temporal solo para el publisher
          queueOptions: {
            durable: true,
            autoDelete: true,  // Se elimina cuando no hay consumers
          },
          // El exchange donde se publicarán los eventos
          exchange: process.env.RABBITMQ_EXCHANGE || 'microservices.events',
          exchangeType: 'topic',
          // Routing key basado en el pattern del emit()
          routingKey: '',
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, RawRabbitPublisher],
})
export class OrdersModule {}
