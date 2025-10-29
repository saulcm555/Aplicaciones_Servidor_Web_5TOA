import { InputType, Int, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductOrderInput {
  @Field(() => Int, { description: 'Order ID' })
  orderId: number;

  @Field(() => Int, { description: 'Product ID' })
  productId: number;

  @Field(() => Int, { description: 'Quantity' })
  quantity: number;

  @Field(() => Float, { description: 'Unit price' })
  unitPrice: number;
}
