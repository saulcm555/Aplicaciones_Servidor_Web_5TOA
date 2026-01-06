import { Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesResolver } from './clientes.resolver';
import { HttpModule } from '@nestjs/axios';
import { HttpServices } from 'src/services/http.services';

@Module({ imports: [HttpModule],
  providers: [ClientesResolver, HttpServices],
})
export class ClientesModule {}
