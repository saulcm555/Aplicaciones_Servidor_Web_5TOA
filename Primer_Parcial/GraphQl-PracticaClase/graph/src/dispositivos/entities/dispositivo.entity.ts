import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@ObjectType()
export class Dispositivo {
    @Field(() => ID, { description: 'id del cliente' })
    id: string;
  
    @Field(() => String, { description: 'id del cliente' })
    descripcion: string;

    @Field(() => String, { description: 'id del cliente' })
    idcliente: string;

    @Field(() => Cliente, { description: 'id del cliente' })
    cliente: Cliente;
}
