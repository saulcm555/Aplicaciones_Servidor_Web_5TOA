import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Hotele } from '../../hoteles/entities/hotele.entity';
import { Reserva } from '../../reservas/entities/reserva.entity';

@Entity('habitaciones')
export class Habitacione {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  categoria: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen_url: string;

  @Column({ type: 'boolean', default: false })
  wifi: boolean;

  @Column({ type: 'boolean', default: false })
  tv: boolean;

  @Column({ type: 'boolean', default: false })
  aire_acondicionado: boolean;

  @Column({ type: 'boolean', default: false })
  minibar: boolean;

  @Column({ type: 'boolean', default: false })
  desayuno_incluido: boolean;

  // Relación N:1 con Hotel
  @ManyToOne(() => Hotele, (hotel) => hotel.habitaciones, { eager: true })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotele;

  // Relación 1:N con Reserva
  @OneToMany(() => Reserva, (reserva) => reserva.habitacion)
  reservas: Reserva[];
}
