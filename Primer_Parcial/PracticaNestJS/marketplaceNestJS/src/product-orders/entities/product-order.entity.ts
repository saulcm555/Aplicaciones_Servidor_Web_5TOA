import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('product_order')
export class ProductOrder {
  @PrimaryGeneratedColumn('increment', { name: 'id_product_order' })
  id_product_order: number;

  @Column({ name: 'id_order', type: 'int' })
  id_order: number;

  @Column({ name: 'id_product', type: 'int' })
  id_product: number;

  @Column({ name: 'price_unit', type: 'decimal', precision: 10, scale: 2 })
  price_unit: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  // Relaciones
  @ManyToOne(() => Order, (order) => order.productOrders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_order' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.productOrders)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}
