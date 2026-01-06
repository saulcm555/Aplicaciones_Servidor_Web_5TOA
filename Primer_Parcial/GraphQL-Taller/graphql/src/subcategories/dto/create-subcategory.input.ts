import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional } from 'class-validator';

@InputType()
export class CreateSubCategoryInput {
  @Field({ description: 'SubCategory name' })
  @IsString()
  @IsNotEmpty({ message: 'SubCategory name is required' })
  sub_category_name: string;

  @Field({ nullable: true, description: 'SubCategory description' })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Int, { description: 'Category ID' })
  @IsInt()
  @IsPositive()
  id_category: number;
}
