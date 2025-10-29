import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSellerDto {
	@IsString()
	@IsNotEmpty()
	seller_name: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	phone?: string;

	@IsOptional()
	@IsString()
	description?: string;
}
