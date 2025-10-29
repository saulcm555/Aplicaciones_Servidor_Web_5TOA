import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ProductOrder {
  @Field(() => Int, { description: 'Product Order ID' })
  id: number;

  @Field(() => Int, { description: 'Order ID' })
  orderId: number;

  @Field(() => Int, { description: 'Product ID' })
  productId: number;

  @Field(() => Int, { description: 'Quantity' })
  quantity: number;

  @Field(() => Float, { description: 'Unit price' })
  unitPrice: number;

  @Field(() => Float, { description: 'Subtotal' })
  subtotal: number;
}
