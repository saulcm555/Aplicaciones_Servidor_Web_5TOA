import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubcategoryProductsService } from './subcategory-products.service';
import { CreateSubcategoryProductDto } from './dto/create-subcategory-product.dto';
import { UpdateSubcategoryProductDto } from './dto/update-subcategory-product.dto';

@Controller('subcategory-products')
export class SubcategoryProductsController {
  constructor(private readonly subcategoryProductsService: SubcategoryProductsService) {}

  @Post()
  create(@Body() createSubcategoryProductDto: CreateSubcategoryProductDto) {
    return this.subcategoryProductsService.create(createSubcategoryProductDto);
  }

  @Get()
  findAll() {
    return this.subcategoryProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subcategoryProductsService.findOne(+id);
  }

  @Get('subcategory/:subcategoryId')
  findBySubcategory(@Param('subcategoryId') subcategoryId: string) {
    return this.subcategoryProductsService.findBySubcategory(+subcategoryId);
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.subcategoryProductsService.findByProduct(+productId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubcategoryProductDto: UpdateSubcategoryProductDto) {
    return this.subcategoryProductsService.update(+id, updateSubcategoryProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subcategoryProductsService.remove(+id);
  }
}
