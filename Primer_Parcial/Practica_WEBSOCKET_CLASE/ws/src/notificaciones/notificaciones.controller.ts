import { Body, Controller, Post } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { DispositivosGateway } from 'src/dispositivos/dispositivos.gateway';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: DispositivosGateway) {}
  @Post("crear-dispositivo")
  crearDispositivo(@Body() mensaje:any){
    this.notificacionesService.emitirMensaje("crear-dispositivo", mensaje)
  }
}
