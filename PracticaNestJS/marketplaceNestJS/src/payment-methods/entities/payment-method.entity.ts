import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

@Entity('payment_method')
export class PaymentMethod {
  @PrimaryGeneratedColumn('increment', { name: 'id_payment_method' })
  id_payment_method: number;

  @Column({ name: 'method_name', type: 'varchar' })
  method_name: string;

  @Column({ name: 'details_payment', type: 'text', nullable: true })
  details_payment: string;

  // Relaciones
  @OneToMany(() => Order, (order) => order.paymentMethod)
  orders: Order[];
}
