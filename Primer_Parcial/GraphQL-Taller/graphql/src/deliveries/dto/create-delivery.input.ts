import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsPositive, IsString, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateDeliveryInput {
  @Field(() => Int, { description: 'Order ID' })
  @IsInt()
  @IsPositive()
  orderId: number;

  @Field({ description: 'Delivery status' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @Field({ description: 'Delivery address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @Field({ description: 'Delivery date', nullable: true })
  @IsString()
  @IsOptional()
  deliveryDate?: string;
}
