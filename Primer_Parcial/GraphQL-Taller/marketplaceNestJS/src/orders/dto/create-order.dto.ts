import { IsInt, IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @IsInt()
  @IsNotEmpty()
  id_client: number;

  @IsInt()
  @IsOptional()
  id_cart?: number;

  @IsInt()
  @IsNotEmpty()
  id_payment_method: number;

  @IsInt()
  @IsOptional()
  id_delivery?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  total_amount: number;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  status?: string;

  @IsString()
  @IsOptional()
  delivery_date?: string;
}
