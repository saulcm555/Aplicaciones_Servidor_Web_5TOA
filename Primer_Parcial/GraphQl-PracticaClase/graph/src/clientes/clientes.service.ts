import { Injectable } from '@nestjs/common';
import { CreateClienteInput } from './dto/create-cliente.input';
import { UpdateClienteInput } from './dto/update-cliente.input';

@Injectable()
export class ClientesService {
  

  findAll() {
    return `This action returns all clientes`;
  }

  findOne(id: string) {
    return `This action returns a #${id} cliente`;
  }

}
