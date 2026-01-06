import { CreateDeliveryInput } from './create-delivery.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateDeliveryInput extends PartialType(CreateDeliveryInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
