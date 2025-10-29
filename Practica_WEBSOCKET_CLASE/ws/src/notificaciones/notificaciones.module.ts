import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { DispositivosGateway } from 'src/dispositivos/dispositivos.gateway';
import { DispositivosModule } from 'src/dispositivos/dispositivos.module';

@Module({
  imports: [DispositivosModule], 
  controllers: [NotificacionesController],
  providers: [NotificacionesService, DispositivosGateway],
})
export class NotificacionesModule {}
