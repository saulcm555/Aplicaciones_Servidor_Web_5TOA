import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ============================================
  // REST API Endpoints (HTTP)
  // ============================================

  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: Partial<CreateProductDto>) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // ============================================
  // RabbitMQ Message Pattern (Event-Driven)
  // ============================================

  @MessagePattern('product.reserveStock')
  async reserveStock(data: { productId: string; quantity: number; idempotencyKey: string }) {
    const { productId, quantity, idempotencyKey } = data;
    return this.productsService.reserveStock(productId, quantity, idempotencyKey);
  }
}
