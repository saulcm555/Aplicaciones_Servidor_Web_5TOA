import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCartsService } from './product-carts.service';
import { ProductCartsController } from './product-carts.controller';
import { ProductCart } from './entities/product-cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCart])],
  controllers: [ProductCartsController],
  providers: [ProductCartsService],
  exports: [ProductCartsService],
})
export class ProductCartsModule {}
