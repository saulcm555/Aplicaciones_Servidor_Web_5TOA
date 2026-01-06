import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, IsInt, IsPositive, Min } from 'class-validator';

@InputType()
export class CreateProductoInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_seller?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_category?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id_sub_category?: number;

  @Field()
  @IsString()
  product_name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive()
  @Min(0.01)
  price: number;

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  stock: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  photo?: string;
}
