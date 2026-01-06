import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Cart } from '../../carts/entities/cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('product_cart')
export class ProductCart {
  @PrimaryGeneratedColumn('increment', { name: 'id_product_cart' })
  id_product_cart: number;

  @Column({ name: 'id_product', type: 'int' })
  id_product: number;

  @Column({ name: 'id_cart', type: 'int' })
  id_cart: number;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({ name: 'added_at', type: 'datetime' })
  added_at: Date;

  // Relaciones
  @ManyToOne(() => Cart, (cart) => cart.productCarts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cart' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.productCarts)
  @JoinColumn({ name: 'id_product' })
  product: Product;
}
