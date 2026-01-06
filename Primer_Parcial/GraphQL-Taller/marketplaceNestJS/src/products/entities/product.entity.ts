import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ProductCart } from '../../product-carts/entities/product-cart.entity';
import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import { SubcategoryProduct } from '../../subcategory-products/entities/subcategory-product.entity';
import { Seller } from '../../sellers/entities/seller.entity';
import { Category } from '../../categories/entities/category.entity';
import { SubCategory } from '../../categories/entities/sub-category.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('increment', { name: 'id_product' })
  id_product: number;

  @ManyToOne(() => Seller, (seller) => seller.products, { nullable: true })
  @JoinColumn({ name: 'id_seller' })
  seller: Seller;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'id_category' })
  category: Category;

  @ManyToOne(() => SubCategory, { nullable: true })
  @JoinColumn({ name: 'id_sub_category' })
  subCategory: SubCategory;

  @Column({ name: 'product_name', type: 'varchar', length: 255 })
  product_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  // Relaciones
  @OneToMany(() => ProductCart, (productCart) => productCart.product)
  productCarts: ProductCart[];

  @OneToMany(() => ProductOrder, (productOrder) => productOrder.product)
  productOrders: ProductOrder[];

  @OneToMany(() => SubcategoryProduct, (subcategoryProduct) => subcategoryProduct.product)
  subcategoryProducts: SubcategoryProduct[];
}
