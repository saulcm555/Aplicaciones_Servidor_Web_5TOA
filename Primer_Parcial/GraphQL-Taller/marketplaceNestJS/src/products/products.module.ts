import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { Category } from '../categories/entities/category.entity';
import { SubCategory } from '../categories/entities/sub-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Seller,
      Category,
      SubCategory,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
