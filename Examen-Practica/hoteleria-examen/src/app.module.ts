import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriasDestinosModule } from './categorias_destinos/categorias_destinos.module';
import { DestinosModule } from './destinos/destinos.module';
import { HotelesModule } from './hoteles/hoteles.module';
import { HabitacionesModule } from './habitaciones/habitaciones.module';
import { ClientesModule } from './clientes/clientes.module';
import { ReservasModule } from './reservas/reservas.module';
import { WebhookModule } from '../websocket/webhook.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'hoteleria.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo - crea las tablas automáticamente
      logging: true, // Ver queries SQL en consola
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    CategoriasDestinosModule,
    DestinosModule,
    HotelesModule,
    HabitacionesModule,
    ClientesModule,
    ReservasModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
