import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Dispositivo } from 'src/dispositivos/entities/dispositivo.entity';

@ObjectType()
export class Cliente {
  @Field(() => ID, { description: 'id del cliente' })
  id: string;

  @Field(() => String, { description: 'id del cliente' })
  nombre: string;

  @Field(() => String, { description: 'id del cliente' })
  correo: string;

  @Field(() => [Dispositivo], { description: 'id del cliente' })
  dispositivos: Dispositivo[];


  


}
