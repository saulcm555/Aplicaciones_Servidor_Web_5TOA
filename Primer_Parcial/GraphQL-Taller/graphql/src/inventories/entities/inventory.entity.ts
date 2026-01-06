import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Seller } from '../../sellers/entities/seller.entity';

@ObjectType()
export class Inventory {
  @Field(() => Int, { description: 'Inventory ID' })
  id_inventory: number;

  @Field(() => Int, { description: 'Seller ID' })
  id_seller: number;

  @Field({ nullable: true, description: 'Warehouse location' })
  location?: string;

  @Field(() => Int, { description: 'Total stock quantity' })
  stock_total: number;

  @Field(() => GraphQLISODateTime, { description: 'Creation date' })
  created_at: Date;

  @Field(() => Seller, { nullable: true, description: 'Seller associated with this inventory' })
  seller?: Seller;
}
