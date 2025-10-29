import { CreateProductCartInput } from './create-product-cart.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductCartInput extends PartialType(CreateProductCartInput) {
  @Field(() => Int)
  id: number;
}
