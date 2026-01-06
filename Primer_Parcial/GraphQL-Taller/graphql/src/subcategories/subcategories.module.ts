import { Module } from '@nestjs/common';
import { SubCategoriesService } from './subcategories.service';
import { SubCategoriesResolver } from './subcategories.resolver';

@Module({
  providers: [SubCategoriesResolver, SubCategoriesService],
  exports: [SubCategoriesService],
})
export class SubCategoriesModule {}
