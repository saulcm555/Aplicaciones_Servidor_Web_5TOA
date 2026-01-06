import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { SubCategory } from '../../categories/entities/sub-category.entity';

@Entity('subcategory_product')
export class SubcategoryProduct {
  @PrimaryGeneratedColumn('increment', { name: 'id_subcategory_product' })
  id_subcategory_product: number;

  @Column({ name: 'id_subcategory', type: 'int' })
  id_subcategory: number;

  @Column({ name: 'id_product', type: 'int' })
  id_product: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  // Relaciones
  @ManyToOne(() => Product, (product) => product.subcategoryProducts)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @ManyToOne(() => SubCategory, (subcategory) => subcategory.subcategoryproducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_subcategory' })
  subcategory: SubCategory;
  
}
