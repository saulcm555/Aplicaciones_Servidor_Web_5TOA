import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SubCategory } from './sub-category.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('increment', { name: 'id_category' })
  id_category: number;

  @Column({ name: 'category_name', type: 'varchar', length: 100 })
  category_name: string;

  @Column({ name: 'category_description', type: 'varchar', nullable: true })
  category_description: string;

  @Column({ name: 'category_photo', type: 'varchar', nullable: true })
  category_photo: string;

  // Relación bidireccional OneToMany con SubCategory
  @OneToMany(() => SubCategory, (subCategory) => subCategory.category, {
    cascade: true,
  })
  subCategories: SubCategory[];
}
