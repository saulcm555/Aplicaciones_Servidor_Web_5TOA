import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Inventory } from '../../inventories/entities/inventory.entity';
import { Producto } from '../../productos/entities/producto.entity';

@ObjectType()
export class Seller {
  @Field(() => Int, { description: 'Seller ID' })
  id_seller: number;

  @Field({ description: 'Seller name' })
  seller_name: string;

  @Field({ description: 'Seller email', nullable: true })
  email?: string;

  @Field({ description: 'Seller phone', nullable: true })
  phone?: string;

  @Field({ description: 'Seller description', nullable: true })
  description?: string;

  @Field(() => GraphQLISODateTime, { description: 'Creation date' })
  created_at: Date;

  @Field(() => [Inventory], { nullable: true, description: 'Inventories managed by this seller' })
  inventories?: Inventory[];

  @Field(() => [Producto], { nullable: true, description: 'Products sold by this seller' })
  products?: Producto[];
}
