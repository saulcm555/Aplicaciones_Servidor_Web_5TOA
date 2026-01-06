import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductOrdersService } from './product-orders.service';
import { CreateProductOrderDto } from './dto/create-product-order.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';

@Controller('product-orders')
export class ProductOrdersController {
  constructor(private readonly productOrdersService: ProductOrdersService) {}

  @Post()
  create(@Body() createProductOrderDto: CreateProductOrderDto) {
    return this.productOrdersService.create(createProductOrderDto);
  }

  @Get()
  findAll() {
    return this.productOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductOrderDto: UpdateProductOrderDto) {
    return this.productOrdersService.update(+id, updateProductOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productOrdersService.remove(+id);
  }
}
