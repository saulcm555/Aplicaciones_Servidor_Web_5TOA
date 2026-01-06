import { CreateSubcategoryProductInput } from './create-subcategory-product.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubcategoryProductInput extends PartialType(CreateSubcategoryProductInput) {
  @Field(() => Int)
  id: number;
}
