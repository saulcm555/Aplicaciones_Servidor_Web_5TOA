import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreateClientInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @Field()
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  phone: string;

  @Field()
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  address: string;
}
