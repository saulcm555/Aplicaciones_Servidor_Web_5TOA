import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreatePaymentMethodInput {
  @Field({ description: 'Payment method name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ description: 'Payment method description', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ description: 'Is active', defaultValue: true })
  @IsBoolean()
  isActive: boolean;
}
