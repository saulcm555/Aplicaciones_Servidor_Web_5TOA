import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSellerInput {
  @Field({ description: 'Seller name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ description: 'Seller email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ description: 'Seller phone', nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ description: 'Business name', nullable: true })
  @IsOptional()
  @IsString()
  businessName?: string;
}
