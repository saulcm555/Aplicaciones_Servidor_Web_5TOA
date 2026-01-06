import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSubcategoryProductInput {
  @Field(() => Int, { description: 'Subcategory ID' })
  id_subcategory: number;

  @Field(() => Int, { description: 'Product ID' })
  id_product: number;
}
