import { Module } from '@nestjs/common';
import { DispositivosService } from './dispositivos.service';
import { DispositivosGateway } from './dispositivos.gateway';

@Module({
  providers: [DispositivosGateway],
})
export class DispositivosModule {}
