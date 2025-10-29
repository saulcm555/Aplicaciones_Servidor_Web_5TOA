import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateProductCartInput {
  @Field(() => Int, { description: 'Cart ID' })
  cartId: number;

  @Field(() => Int, { description: 'Product ID' })
  productId: number;

  @Field(() => Int, { description: 'Quantity' })
  quantity: number;
}
