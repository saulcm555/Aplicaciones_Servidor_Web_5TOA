import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Habitacione } from '../../habitaciones/entities/habitacione.entity';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 20, default: 'pendiente' })
  estado: string; // pendiente, confirmada, cancelada

  // Relación N:1 con Cliente
  @ManyToOne(() => Cliente, (cliente) => cliente.reservas, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  // Relación N:1 con Habitacion
  @ManyToOne(() => Habitacione, (habitacion) => habitacion.reservas, { eager: true })
  @JoinColumn({ name: 'habitacion_id' })
  habitacion: Habitacione;
}
