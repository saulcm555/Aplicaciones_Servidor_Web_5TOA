import { PartialType } from '@nestjs/mapped-types';
import { CreateHoteleDto } from './create-hotele.dto';

export class UpdateHoteleDto extends PartialType(CreateHoteleDto) {}
