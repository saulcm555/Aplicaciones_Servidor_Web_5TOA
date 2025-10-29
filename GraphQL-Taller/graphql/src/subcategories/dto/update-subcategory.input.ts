import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateSubCategoryInput } from './create-subcategory.input';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateSubCategoryInput extends PartialType(CreateSubCategoryInput) {
  @Field(() => Int, { description: 'SubCategory ID to update' })
  @IsInt()
  @IsPositive()
  id_sub_category: number;
}
