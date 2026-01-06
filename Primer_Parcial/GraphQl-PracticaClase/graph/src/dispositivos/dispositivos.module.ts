import { Module } from '@nestjs/common';
import { DispositivosService } from './dispositivos.service';
import { DispositivosResolver } from './dispositivos.resolver';
import { HttpModule } from '@nestjs/axios';
import { HttpServices } from 'src/services/http.services';

@Module({ imports : [HttpModule],
  providers: [DispositivosResolver, HttpServices],
})
export class DispositivosModule {}
