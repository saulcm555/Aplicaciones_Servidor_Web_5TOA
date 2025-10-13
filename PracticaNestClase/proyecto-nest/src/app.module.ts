import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DispositivosModule } from './dispositivos/dispositivos.module';
import { Dispositivo } from './dispositivos/entities/dispositivo.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite', // El driver correcto es 'sqlite', no 'sqlite3'
      database: process.env.DATABASE,// No uses host ni puerto con SQLite
      entities: [Dispositivo],
      synchronize: true,
    }),
    DispositivosModule,
  ],
})
export class AppModule {}
