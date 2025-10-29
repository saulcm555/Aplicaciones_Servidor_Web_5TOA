import { IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
	@IsString()
	@IsNotEmpty()
	product_name: string;

	@IsOptional()
	@IsString()
	description?: string;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	price: number;

	@Type(() => Number)
	@IsInt()
	@Min(0)
	stock: number;

	@IsOptional()
	@IsInt()
	id_seller?: number;

	@IsOptional()
	@IsInt()
	id_category?: number;

	@IsOptional()
	@IsInt()
	id_sub_category?: number;

	@IsOptional()
	@IsString()
	photo?: string;
}
