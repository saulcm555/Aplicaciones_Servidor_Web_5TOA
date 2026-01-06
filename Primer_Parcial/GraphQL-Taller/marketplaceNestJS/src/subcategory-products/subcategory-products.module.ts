import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubcategoryProductsService } from './subcategory-products.service';
import { SubcategoryProductsController } from './subcategory-products.controller';
import { SubcategoryProduct } from './entities/subcategory-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubcategoryProduct])],
  controllers: [SubcategoryProductsController],
  providers: [SubcategoryProductsService],
  exports: [SubcategoryProductsService],
})
export class SubcategoryProductsModule {}
