import { CreateOrderInput } from './create-order.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
