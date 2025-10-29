import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  id_seller?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  id_category?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  id_sub_category?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  stock: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  photo?: string;
}
