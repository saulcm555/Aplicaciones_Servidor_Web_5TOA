import { CreateInventoryInput } from './create-inventory.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateInventoryInput extends PartialType(CreateInventoryInput) {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  id: number;
}
