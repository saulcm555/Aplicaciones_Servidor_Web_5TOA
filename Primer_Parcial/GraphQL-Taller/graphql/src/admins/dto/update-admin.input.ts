import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateAdminInput } from './create-admin.input';
import { IsInt, IsPositive } from 'class-validator';

@InputType()
export class UpdateAdminInput extends PartialType(CreateAdminInput) {
  @Field(() => Int, { description: 'Admin ID to update' })
  @IsInt()
  @IsPositive()
  id_admin: number;
}
