import { IsInt, IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString, MaxLength } from 'class-validator';

export class CreateDeliveryDto {
  @IsInt()
  @IsOptional()
  id_product?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  delivery_address: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  status: string;

  @IsDateString()
  @IsOptional()
  estimated_time?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  delivery_person?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  delivery_cost: number;
}
