import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Client } from '../../clients/entities/client.entity';
import { ProductCart } from '../../product-carts/entities/product-cart.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('cart')
export class Cart {
  @PrimaryGeneratedColumn('increment', { name: 'id_cart' })
  id_cart: number;

  @Column({ name: 'id_client', type: 'int' })
  id_client: number;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updated_at: Date;

  // Relaciones
  @ManyToOne(() => Client, (client) => client.carts)
  @JoinColumn({ name: 'id_client' })
  client: Client;

  @OneToMany(() => ProductCart, (productCart) => productCart.cart)
  productCarts: ProductCart[];

  @OneToMany(() => Order, (order) => order.cart)
  orders: Order[];
}