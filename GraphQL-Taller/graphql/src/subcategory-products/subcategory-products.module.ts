import { Module } from '@nestjs/common';
import { SubcategoryProductsService } from './subcategory-products.service';
import { SubcategoryProductsResolver } from './subcategory-products.resolver';

@Module({
  providers: [SubcategoryProductsResolver, SubcategoryProductsService],
})
export class SubcategoryProductsModule {}
