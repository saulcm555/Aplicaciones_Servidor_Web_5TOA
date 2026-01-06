import { Module } from '@nestjs/common';
import { ProductOrdersService } from './product-orders.service';
import { ProductOrdersResolver } from './product-orders.resolver';

@Module({
  providers: [ProductOrdersResolver, ProductOrdersService],
})
export class ProductOrdersModule {}
