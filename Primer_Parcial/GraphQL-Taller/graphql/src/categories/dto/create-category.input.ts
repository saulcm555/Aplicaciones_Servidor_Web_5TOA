import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field({ description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  category_name: string;

  @Field({ description: 'Category description', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}
