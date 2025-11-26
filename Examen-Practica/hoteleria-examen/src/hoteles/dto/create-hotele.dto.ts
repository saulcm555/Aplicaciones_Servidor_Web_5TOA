import { IsString, IsNotEmpty, IsNumber, IsOptional, MaxLength } from 'class-validator';

export class CreateHoteleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  direccion: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imagen_url?: string;

  @IsNumber()
  @IsNotEmpty()
  destino_id: number;
}
