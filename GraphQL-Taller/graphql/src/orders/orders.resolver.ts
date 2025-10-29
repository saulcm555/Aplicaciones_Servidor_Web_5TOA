import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Client } from '../clients/entities/client.entity';
import { Cart } from '../carts/entities/cart.entity';
import { PaymentMethod } from '../payment-methods/entities/payment-method.entity';
import { ProductOrder } from '../product-orders/entities/product-order.entity';
import { Delivery } from '../deliveries/entities/delivery.entity';
import axios from 'axios';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ordersService.findOne(id);
  }

  @ResolveField(() => Client, { nullable: true })
  async client(@Parent() order: Order): Promise<Client | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/clients/${order.id_client}`);
      return {
        id_client: response.data.id_client,
        client_name: response.data.client_name,
        client_email: response.data.client_email,
        phone: response.data.phone,
        address: response.data.address,
        created_at: response.data.created_at,
      };
    } catch (error) {
      console.error(`❌ Error fetching client for order #${order.id_order}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => Cart, { nullable: true })
  async cart(@Parent() order: Order): Promise<Cart | null> {
    if (!order.id_cart) return null;
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/carts/${order.id_cart}`);
      return {
        id_cart: response.data.id_cart,
        id_client: response.data.id_client,
        status: response.data.status,
        created_at: new Date(response.data.created_at),
        updated_at: new Date(response.data.updated_at),
      };
    } catch (error) {
      console.error(`❌ Error fetching cart for order #${order.id_order}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => PaymentMethod, { nullable: true })
  async paymentMethod(@Parent() order: Order): Promise<PaymentMethod | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/payment-methods/${order.id_payment_method}`);
      return {
        id_payment_method: response.data.id_payment_method,
        method_name: response.data.method_name,
        details_payment: response.data.details_payment,
      };
    } catch (error) {
      console.error(`❌ Error fetching payment method for order #${order.id_order}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => Delivery, { nullable: true })
  async delivery(@Parent() order: Order): Promise<Delivery | null> {
    if (!order.id_delivery) return null;
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/deliveries/${order.id_delivery}`);
      return {
        id_delivery: response.data.id_delivery,
        id_product: response.data.id_product,
        delivery_address: response.data.delivery_address,
        city: response.data.city,
        status: response.data.status,
        estimated_time: response.data.estimated_time ? new Date(response.data.estimated_time) : null,
        delivery_person: response.data.delivery_person,
        delivery_cost: response.data.delivery_cost,
        created_at: new Date(response.data.created_at),
      };
    } catch (error) {
      console.error(`❌ Error fetching delivery for order #${order.id_order}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => [ProductOrder], { nullable: true })
  async productOrders(@Parent() order: Order): Promise<ProductOrder[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/product-orders/order/${order.id_order}`);
      let productOrders = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        productOrders = response.data.data;
      } else if (Array.isArray(response.data)) {
        productOrders = response.data;
      }

      return productOrders.map(po => ({
        id: po.id_product_order,
        orderId: po.id_order,
        productId: po.id_product,
        quantity: po.quantity,
        unitPrice: po.unit_price,
        subtotal: po.quantity * po.unit_price,
      }));
    } catch (error) {
      console.error(`❌ Error fetching product orders for order #${order.id_order}:`, error.response?.data);
      return [];
    }
  }
}
