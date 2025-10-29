import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  category_name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
