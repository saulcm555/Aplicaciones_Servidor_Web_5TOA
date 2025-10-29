import { Module } from '@nestjs/common';
import { ProductCartsService } from './product-carts.service';
import { ProductCartsResolver } from './product-carts.resolver';

@Module({
  providers: [ProductCartsResolver, ProductCartsService],
})
export class ProductCartsModule {}
