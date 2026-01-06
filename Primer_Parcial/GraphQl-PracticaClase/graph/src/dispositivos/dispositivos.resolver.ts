import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { DispositivosService } from './dispositivos.service';
import { Dispositivo } from './entities/dispositivo.entity';
import { CreateDispositivoInput } from './dto/create-dispositivo.input';
import { UpdateDispositivoInput } from './dto/update-dispositivo.input';
import { HttpServices } from 'src/services/http.services';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Resolver(() => Dispositivo)
export class DispositivosResolver {
  constructor(private readonly dispositivosService: HttpServices) {}



  @Query(() => [Dispositivo], { name: 'dispositivos' })
  findAll() {
    return this.dispositivosService.consultar_dispositivos();
  }

  @Query(() => Dispositivo, { name: 'dispositivo' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.dispositivosService.consultar_dispositivo(id);
  }

  @ResolveField(() => Cliente)
  async clientes(@Parent() dispositivo:Dispositivo){
    return await this.dispositivosService.consultar_cliente(dispositivo.idcliente)

  }
}
