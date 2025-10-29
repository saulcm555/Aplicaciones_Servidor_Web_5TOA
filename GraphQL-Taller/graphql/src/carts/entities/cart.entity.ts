import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { GraphQLScalarType } from 'graphql';
import { Client } from 'src/clients/entities/client.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ProductCart } from 'src/product-carts/entities/product-cart.entity';

@ObjectType()
export class Cart {
  @Field(() => Int, { description: 'Cart ID' })
  id_cart: number;

  @Field(() => Int, { description: 'Cart ID' })
  id_client: number;

  @Field({ description: 'Cart status' })
  status: string;

  @Field(() => GraphQLISODateTime, { description: 'Cart status' })
  created_at: Date;
  
  @Field(() => GraphQLISODateTime, { description: 'Last update date' })
  updated_at: Date;

  @Field(() => Client, { description: 'Cliente asociado al carrito', nullable: true })
  client?: Client;

  @Field(() => [ProductCart], { description: 'Productos dentro del carrito', nullable: true })
  productCarts?: ProductCart[];

  @Field(() => [Order], { description: 'Órdenes asociadas al carrito', nullable: true })
  orders?: Order[];
}

