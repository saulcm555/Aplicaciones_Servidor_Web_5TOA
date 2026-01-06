import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryProductDto } from './create-subcategory-product.dto';

export class UpdateSubcategoryProductDto extends PartialType(CreateSubcategoryProductDto) {}
