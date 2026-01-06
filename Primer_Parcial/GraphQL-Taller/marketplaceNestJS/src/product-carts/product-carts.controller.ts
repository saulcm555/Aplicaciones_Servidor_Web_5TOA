import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductCartsService } from './product-carts.service';
import { CreateProductCartDto } from './dto/create-product-cart.dto';
import { UpdateProductCartDto } from './dto/update-product-cart.dto';

@Controller('product-carts')
export class ProductCartsController {
  constructor(private readonly productCartsService: ProductCartsService) {}

  @Post()
  create(@Body() createProductCartDto: CreateProductCartDto) {
    return this.productCartsService.create(createProductCartDto);
  }

  @Get()
  findAll() {
    return this.productCartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductCartDto: UpdateProductCartDto) {
    return this.productCartsService.update(+id, updateProductCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCartsService.remove(+id);
  }
}
