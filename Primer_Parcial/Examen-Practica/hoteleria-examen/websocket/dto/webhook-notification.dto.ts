import { IsString, IsNotEmpty, IsIn, IsNumber, IsOptional } from 'class-validator';

export class WebhookNotificationDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['create', 'update', 'delete', 'confirmar', 'cancelar'])
  tipo_operacion: string; // Tipo de operación realizada

  @IsString()
  @IsNotEmpty()
  entidad: string; // Nombre de la entidad (categorias, destinos, hoteles, etc.)

  @IsNumber()
  @IsOptional()
  id?: number; // ID del recurso afectado

  @IsOptional()
  datos?: any; // Datos relevantes del recurso (el objeto completo o parcial)

  @IsString()
  @IsOptional()
  mensaje?: string; // Mensaje descriptivo de la operación
}
