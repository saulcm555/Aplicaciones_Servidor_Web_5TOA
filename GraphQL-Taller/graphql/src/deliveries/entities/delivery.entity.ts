import { ObjectType, Field, Int, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { Order } from '../../orders/entities/order.entity';

@ObjectType()
export class Delivery {
  @Field(() => Int, { description: 'Delivery ID' })
  id_delivery: number;

  @Field(() => Int, { nullable: true, description: 'Product ID' })
  id_product?: number;

  @Field({ description: 'Delivery address' })
  delivery_address: string;

  @Field({ description: 'City' })
  city: string;

  @Field({ description: 'Delivery status' })
  status: string;

  @Field(() => GraphQLISODateTime, { nullable: true, description: 'Estimated delivery time' })
  estimated_time?: Date;

  @Field({ nullable: true, description: 'Delivery person name' })
  delivery_person?: string;

  @Field(() => Float, { description: 'Delivery cost' })
  delivery_cost: number;

  @Field(() => GraphQLISODateTime, { description: 'Creation date' })
  created_at: Date;

  @Field(() => [Order], { nullable: true, description: 'Orders associated with this delivery' })
  orders?: Order[];
}
