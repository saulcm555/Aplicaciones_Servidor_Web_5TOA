import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsInt, IsPositive, IsNumber, Min, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @Field(() => Int, { description: 'Client ID' })
  @IsInt()
  @IsPositive()
  clientId: number;

  @Field(() => Float, { description: 'Order total' })
  @IsNumber()
  @Min(0.01)
  total: number;

  @Field({ description: 'Order status' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
