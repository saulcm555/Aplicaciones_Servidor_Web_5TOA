import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsPositive, Min, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreateInventoryInput {
  @Field(() => Int, { description: 'Product ID' })
  @IsInt()
  @IsPositive()
  productId: number;

  @Field(() => Int, { description: 'Stock quantity' })
  @IsInt()
  @Min(0)
  quantity: number;

  @Field({ description: 'Warehouse location', nullable: true })
  @IsString()
  @IsOptional()
  location?: string;
}
