import { CreateClientInput } from './create-client.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateClientInput extends PartialType(CreateClientInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
