import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductOrdersService } from './product-orders.service';
import { ProductOrder } from './entities/product-order.entity';
import { CreateProductOrderInput } from './dto/create-product-order.input';
import { UpdateProductOrderInput } from './dto/update-product-order.input';

@Resolver(() => ProductOrder)
export class ProductOrdersResolver {
  constructor(private readonly productOrdersService: ProductOrdersService) {}

  @Query(() => [ProductOrder], { name: 'productOrders' })
  findAll() {
    return this.productOrdersService.findAll();
  }

  @Query(() => ProductOrder, { name: 'productOrder' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productOrdersService.findOne(id);
  }

  @Query(() => [ProductOrder], { name: 'productOrdersByOrder' })
  findByOrder(@Args('orderId', { type: () => Int }) orderId: number) {
    return this.productOrdersService.findByOrder(orderId);
  }
}
