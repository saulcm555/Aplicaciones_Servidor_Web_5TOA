import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoriasDestinoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;
}
