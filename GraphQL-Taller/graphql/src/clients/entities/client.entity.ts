import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Cart } from 'src/carts/entities/cart.entity';

@ObjectType()
export class Client {
  @Field(() => Int)
  id_client: number;

  @Field()
  client_name: string;

  @Field()
  client_email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  created_at: string;

  @Field(() => [Cart], { description: 'Carritos asociados al cliente', nullable: true })
  carts?: Cart[];
}
