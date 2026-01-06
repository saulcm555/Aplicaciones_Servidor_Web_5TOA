import { Injectable } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

const clientes = [
  {
    id: '1',
    nombre: 'joustin',
    correo: 'user@mail'
  },
  {
    id: '2',
    nombre: 'user',
    correo: 'user@mail'
  },
  {
    id: '3',
    nombre: 'carlos',
    correo: 'user@mail'
  }
]
@Injectable()
export class ClientesService {


  findAll() {
    return clientes;
  }

  findOne(id: string) {
    return clientes.find(cliente=>cliente.id===id);
  }

  
}
