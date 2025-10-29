import { CreateProductOrderInput } from './create-product-order.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductOrderInput extends PartialType(CreateProductOrderInput) {
  @Field(() => Int)
  id: number;
}
