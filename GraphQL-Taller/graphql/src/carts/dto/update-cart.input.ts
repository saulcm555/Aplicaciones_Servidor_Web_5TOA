import { CreateCartInput } from './create-cart.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateCartInput extends PartialType(CreateCartInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
