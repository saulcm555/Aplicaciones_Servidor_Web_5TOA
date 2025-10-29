import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { PaymentMethod } from '../../payment-methods/entities/payment-method.entity';
import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import { Delivery } from '../../deliveries/entities/delivery.entity';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn('increment', { name: 'id_order' })
  id_order: number;

  @Column({ name: 'order_date', type: 'datetime' })
  order_date: Date;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ name: 'delivery_date', type: 'varchar', length: 255, nullable: true })
  delivery_date: string;

  @Column({ name: 'id_client', type: 'int' })
  id_client: number;

  @Column({ name: 'id_cart', type: 'int', nullable: true })
  id_cart: number;

  @Column({ name: 'id_payment_method', type: 'int' })
  id_payment_method: number;

  @Column({ name: 'id_delivery', type: 'int', nullable: true })
  id_delivery: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  // Relaciones
  @ManyToOne(() => Cart, { nullable: true })
  @JoinColumn({ name: 'id_cart' })
  cart: Cart;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.orders)
  @JoinColumn({ name: 'id_payment_method' })
  paymentMethod: PaymentMethod;

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.order)
  productOrders: ProductOrder[];

  @ManyToOne(() => Delivery, (delivery) => delivery.orders, { nullable: true })
  @JoinColumn({ name: 'id_delivery' })
  delivery: Delivery;
}
