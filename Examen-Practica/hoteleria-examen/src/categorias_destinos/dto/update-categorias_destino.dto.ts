import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriasDestinoDto } from './create-categorias_destino.dto';

export class UpdateCategoriasDestinoDto extends PartialType(CreateCategoriasDestinoDto) {}
