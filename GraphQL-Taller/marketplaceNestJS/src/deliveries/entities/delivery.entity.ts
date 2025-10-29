import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('delivery')
export class Delivery {
  @PrimaryGeneratedColumn('increment', { name: 'id_delivery' })
  id_delivery: number;

  @Column({ name: 'id_product', type: 'int', nullable: true })
  id_product: number;

  @Column({ name: 'delivery_address', type: 'varchar', length: 255 })
  delivery_address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ name: 'estimated_time', type: 'datetime', nullable: true })
  estimated_time: Date;

  @Column({ name: 'delivery_person', type: 'varchar', length: 255, nullable: true })
  delivery_person: string;

  @Column({ name: 'delivery_cost', type: 'decimal', precision: 10, scale: 2 })
  delivery_cost: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  // Relaciones
  @OneToMany(() => Order, (order) => order.delivery)
  orders: Order[];
}
