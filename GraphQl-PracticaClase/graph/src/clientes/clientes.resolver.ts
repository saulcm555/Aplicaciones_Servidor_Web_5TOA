import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ClientesService } from './clientes.service';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteInput } from './dto/create-cliente.input';
import { UpdateClienteInput } from './dto/update-cliente.input';
import { HttpService } from '@nestjs/axios';
import { HttpServices } from 'src/services/http.services';
import { Dispositivo } from 'src/dispositivos/entities/dispositivo.entity';

@Resolver(() => Cliente)
export class ClientesResolver {
  constructor(private readonly clientesService: HttpServices) {}

  
  @Query(() => [Cliente], { name: 'clientes' })
  findAll() {
    return this.clientesService.consultar_clientes();
  }

  @Query(() => Cliente, { name: 'cliente' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.clientesService.consultar_cliente(id);
  }

  @ResolveField(() => [Dispositivo])
  async dispositivos(@Parent() cliente:Cliente){
    const lista = await this.clientesService.consultar_dispositivos()
    return lista.filter ((l)=>l.idcliente=== cliente.id)

  }
 
}
