import { ObjectType, Field, Int, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { Client } from '../../clients/entities/client.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';
import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';

@ObjectType()
export class Order {
  @Field(() => Int, { description: 'Order ID' })
  id_order: number;

  @Field(() => GraphQLISODateTime, { description: 'Order date' })
  order_date: Date;

  @Field({ description: 'Order status' })
  status: string;

  @Field(() => Float, { description: 'Total amount' })
  total_amount: number;

  @Field({ nullable: true, description: 'Delivery date' })
  delivery_date?: string;

  @Field(() => Int, { description: 'Client ID' })
  id_client: number;

  @Field(() => Int, { nullable: true, description: 'Cart ID' })
  id_cart?: number;

  @Field(() => Int, { description: 'Payment Method ID' })
  id_payment_method: number;

  @Field(() => Int, { nullable: true, description: 'Delivery ID' })
  id_delivery?: number;

  @Field(() => GraphQLISODateTime, { description: 'Creation date' })
  created_at: Date;

  @Field(() => Client, { nullable: true, description: 'Client associated with this order' })
  client?: Client;

  @Field(() => Cart, { nullable: true, description: 'Cart associated with this order' })
  cart?: Cart;

  @Field(() => PaymentMethod, { nullable: true, description: 'Payment method used' })
  paymentMethod?: PaymentMethod;

  @Field(() => [ProductOrder], { nullable: true, description: 'Products in this order' })
  productOrders?: ProductOrder[];

  @Field(() => Delivery, { nullable: true, description: 'Delivery information' })
  delivery?: Delivery;
}
