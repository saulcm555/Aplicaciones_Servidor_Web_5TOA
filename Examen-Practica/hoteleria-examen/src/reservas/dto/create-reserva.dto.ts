import { IsNumber, IsNotEmpty, IsDateString, IsString, IsOptional, IsIn, Min } from 'class-validator';

export class CreateReservaDto {
  @IsNumber()
  @IsNotEmpty()
  cliente_id: number;

  @IsNumber()
  @IsNotEmpty()
  habitacion_id: number;

  @IsDateString()
  @IsNotEmpty()
  fecha_inicio: Date;

  @IsDateString()
  @IsNotEmpty()
  fecha_fin: Date;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  total: number;

  @IsString()
  @IsOptional()
  @IsIn(['pendiente', 'confirmada', 'cancelada'])
  estado?: string;
}
