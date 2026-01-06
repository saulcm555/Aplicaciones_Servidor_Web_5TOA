import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethod } from './entities/payment-method.entity';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
import { Order } from '../orders/entities/order.entity';
import axios from 'axios';

@Resolver(() => PaymentMethod)
export class PaymentMethodsResolver {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Query(() => [PaymentMethod], { name: 'paymentMethods' })
  findAll() {
    return this.paymentMethodsService.findAll();
  }

  @Query(() => PaymentMethod, { name: 'paymentMethod' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.paymentMethodsService.findOne(id);
  }

  @ResolveField(() => [Order], { nullable: true })
  async orders(@Parent() paymentMethod: PaymentMethod) {
    const { id_payment_method } = paymentMethod;
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/orders/payment-method/${id_payment_method}`);
      let ordersData = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      }

      return ordersData.map(order => ({
        id_order: order.id_order,
        order_date: order.order_date ? new Date(order.order_date) : null,
        status: order.status,
        total_amount: order.total_amount,
        delivery_date: order.delivery_date ? new Date(order.delivery_date) : null,
        id_client: order.id_client,
        id_cart: order.id_cart,
        id_payment_method: order.id_payment_method,
        id_delivery: order.id_delivery,
        created_at: order.created_at ? new Date(order.created_at) : null,
      }));
    } catch (error) {
      console.error(`Error fetching orders for payment method ${id_payment_method}:`, error);
      return [];
    }
  }
}
