import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('sub_category')
export class SubCategory {
  @PrimaryGeneratedColumn('increment', { name: 'id_sub_category' })
  id_sub_category: number;

  @Column({ name: 'sub_category_name', type: 'varchar', length: 100 })
  sub_category_name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @Column({ name: 'id_category', type: 'int' })
  id_category: number;

  // Relación bidireccional ManyToOne con Category
  @ManyToOne(() => Category, (category) => category.subCategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_category' })
  category: Category;
}
