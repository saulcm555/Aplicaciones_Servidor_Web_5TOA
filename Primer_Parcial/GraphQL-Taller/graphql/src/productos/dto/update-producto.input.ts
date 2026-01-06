import { CreateProductoInput } from './create-producto.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateProductoInput extends PartialType(CreateProductoInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
