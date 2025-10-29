import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateProductCartDto {
  @IsInt()
  @IsNotEmpty()
  id_product: number;

  @IsInt()
  @IsNotEmpty()
  id_cart: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
