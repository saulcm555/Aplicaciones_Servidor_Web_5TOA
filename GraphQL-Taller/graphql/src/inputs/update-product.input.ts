import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { IsNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  id_product: number;
}
