import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsPositive, IsString, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateCartInput {
  @Field(() => Int, { description: 'Client ID' })
  @IsInt()
  @IsPositive()
  clientId: number;

  @Field({ description: 'Cart status' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
