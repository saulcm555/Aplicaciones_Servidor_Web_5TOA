import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import { Client } from '../clients/entities/client.entity';
import { ProductCart } from '../product-carts/entities/product-cart.entity';
import { Order } from '../orders/entities/order.entity';
import axios from 'axios';

@Resolver(() => Cart)
export class CartsResolver {
  constructor(private readonly cartsService: CartsService) {}


  @Query(() => [Cart], { name: 'carts' })
  findAll() {
    return this.cartsService.findAll();
  }

  @Query(() => Cart, { name: 'cart' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cartsService.findOne(id);
  }

  @ResolveField(() => Client, { nullable: true })
  async client(@Parent() cart: Cart): Promise<Client | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/clients/${cart.id_client}`);
      return {
        id_client: response.data.id_client,
        client_name: response.data.client_name,
        client_email: response.data.client_email,
        phone: response.data.phone,
        address: response.data.address,
        created_at: response.data.created_at,
      };
    } catch (error) {
      console.error(`❌ Error fetching client for cart #${cart.id_cart}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => [ProductCart], { nullable: true })
  async productCarts(@Parent() cart: Cart): Promise<ProductCart[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/product-carts/cart/${cart.id_cart}`);
      let productCarts = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        productCarts = response.data.data;
      } else if (Array.isArray(response.data)) {
        productCarts = response.data;
      }

      return productCarts.map(pc => ({
        id_product_cart: pc.id_product_cart,
        id_product: pc.id_product,
        id_cart: pc.id_cart,
        quantity: pc.quantity,
        added_at: pc.added_at ? new Date(pc.added_at) : null,
      }));
    } catch (error) {
      console.error(`❌ Error fetching product carts for cart #${cart.id_cart}:`, error.response?.data);
      return [];
    }
  }

  @ResolveField(() => [Order], { nullable: true })
  async orders(@Parent() cart: Cart): Promise<Order[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/orders/cart/${cart.id_cart}`);
      let orders = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        orders = response.data.data;
      } else if (Array.isArray(response.data)) {
        orders = response.data;
      }

      return orders.map(order => ({
        id_order: order.id_order,
        order_date: order.order_date ? new Date(order.order_date) : null,
        status: order.status,
        total_amount: order.total_amount,
        delivery_date: order.delivery_date,
        id_client: order.id_client,
        id_cart: order.id_cart,
        id_payment_method: order.id_payment_method,
        id_delivery: order.id_delivery,
        created_at: order.created_at ? new Date(order.created_at) : null,
      }));
    } catch (error) {
      console.error(`❌ Error fetching orders for cart #${cart.id_cart}:`, error.response?.data);
      return [];
    }
  }
}
