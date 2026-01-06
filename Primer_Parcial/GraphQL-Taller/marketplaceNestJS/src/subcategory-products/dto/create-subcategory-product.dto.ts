import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateSubcategoryProductDto {
  @IsInt()
  @IsNotEmpty()
  id_subcategory: number;

  @IsInt()
  @IsNotEmpty()
  id_product: number;
}
