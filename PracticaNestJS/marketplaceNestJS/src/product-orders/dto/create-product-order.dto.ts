import { IsInt, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateProductOrderDto {
  @IsInt()
  @IsNotEmpty()
  id_order: number;

  @IsInt()
  @IsNotEmpty()
  id_product: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  price_unit: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  subtotal: number;
}
