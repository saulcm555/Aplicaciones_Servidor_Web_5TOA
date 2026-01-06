import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { DeliveriesService } from './deliveries.service';
import { Delivery } from './entities/delivery.entity';
import { CreateDeliveryInput } from './dto/create-delivery.input';
import { UpdateDeliveryInput } from './dto/update-delivery.input';
import { Order } from '../orders/entities/order.entity';
import axios from 'axios';

@Resolver(() => Delivery)
export class DeliveriesResolver {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Query(() => [Delivery], { name: 'deliveries' })
  findAll() {
    return this.deliveriesService.findAll();
  }

  @Query(() => Delivery, { name: 'delivery' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.deliveriesService.findOne(id);
  }

  @ResolveField(() => [Order], { nullable: true })
  async orders(@Parent() delivery: Delivery): Promise<Order[]> {
    try {
      // Obtener las órdenes asociadas al delivery desde la REST API
      const response = await axios.get(`http://localhost:3006/api/v1/orders/delivery/${delivery.id_delivery}`);
      let orders = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        orders = response.data.data;
      } else if (Array.isArray(response.data)) {
        orders = response.data;
      }

      return orders.map(order => ({
        id_order: order.id_order,
        order_date: new Date(order.order_date),
        status: order.status,
        total_amount: order.total_amount,
        delivery_date: order.delivery_date,
        id_client: order.id_client,
        id_cart: order.id_cart,
        id_payment_method: order.id_payment_method,
        id_delivery: order.id_delivery,
        created_at: new Date(order.created_at),
      }));
    } catch (error) {
      console.error(`❌ Error fetching orders for delivery #${delivery.id_delivery}:`, error.response?.data);
      return [];
    }
  }
}
