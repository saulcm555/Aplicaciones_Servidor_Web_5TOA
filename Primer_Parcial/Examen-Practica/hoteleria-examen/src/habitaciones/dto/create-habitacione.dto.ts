import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateHabitacioneDto {
  @IsNumber()
  @IsNotEmpty()
  hotel_id: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  categoria: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precio: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  capacidad: number;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imagen_url?: string;

  @IsBoolean()
  @IsOptional()
  wifi?: boolean;

  @IsBoolean()
  @IsOptional()
  tv?: boolean;

  @IsBoolean()
  @IsOptional()
  aire_acondicionado?: boolean;

  @IsBoolean()
  @IsOptional()
  minibar?: boolean;

  @IsBoolean()
  @IsOptional()
  desayuno_incluido?: boolean;
}
