import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Cart } from '../../carts/entities/cart.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('client')
export class Client {
  @PrimaryGeneratedColumn('increment', { name: 'id_client' })
  id_client: number;

  @Column({ name: 'client_name', type: 'varchar', length: 255 })
  client_name: string;

  @Column({ name: 'client_email', type: 'varchar', length: 255, unique: true })
  client_email: string;

  @Column({ name: 'client_password', type: 'varchar', length: 255 })
  client_password: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  // Relaciones
  @OneToMany(() => Cart, (cart) => cart.client)
  carts: Cart[];

}
