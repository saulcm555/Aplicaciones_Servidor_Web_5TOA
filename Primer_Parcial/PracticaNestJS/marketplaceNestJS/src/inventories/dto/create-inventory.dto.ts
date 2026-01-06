import { IsInt, IsNotEmpty, IsOptional, Min, IsString } from 'class-validator';

export class CreateInventoryDto {
	@IsInt()
	@Min(1)
	id_seller: number;

	@IsOptional()
	@IsString()
	location?: string;

	@IsInt()
	@Min(0)
	stock_total: number;
}
