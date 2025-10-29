import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

class ProductQuery {
  seller?: number;
  category?: number;
  subCategory?: number;
  minPrice?: number;
  maxPrice?: number;
  name?: string;
  limit?: number;
  offset?: number;
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('seller') seller?: string,
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('name') name?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const q: ProductQuery = {};
    if (seller) q.seller = parseInt(seller, 10);
    if (category) q.category = parseInt(category, 10);
    if (subCategory) q.subCategory = parseInt(subCategory, 10);
    if (minPrice) q.minPrice = Number(minPrice);
    if (maxPrice) q.maxPrice = Number(maxPrice);
    if (name) q.name = name;
    if (limit) q.limit = parseInt(limit, 10);
    if (offset) q.offset = parseInt(offset, 10);
    return this.productsService.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
