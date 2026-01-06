import { CreatePaymentMethodInput } from './create-payment-method.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdatePaymentMethodInput extends PartialType(CreatePaymentMethodInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
