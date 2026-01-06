import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category_name: string;

  @IsString()
  @IsOptional()
  category_description?: string;

  @IsString()
  @IsOptional()
  category_photo?: string;
}
