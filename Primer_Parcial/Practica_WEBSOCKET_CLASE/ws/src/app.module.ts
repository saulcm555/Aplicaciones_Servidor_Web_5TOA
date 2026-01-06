import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DispositivosModule } from './dispositivos/dispositivos.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';

@Module({
  imports: [DispositivosModule, NotificacionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
