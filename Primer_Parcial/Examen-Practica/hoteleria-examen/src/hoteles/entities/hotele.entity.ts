import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Destino } from '../../destinos/entities/destino.entity';
import { Habitacione } from '../../habitaciones/entities/habitacione.entity';

@Entity('hoteles')
export class Hotele {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255 })
  direccion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen_url: string;

  // Relación N:1 con Destino
  @ManyToOne(() => Destino, (destino) => destino.hoteles, { eager: true })
  @JoinColumn({ name: 'destino_id' })
  destino: Destino;

  // Relación 1:N con Habitacion
  @OneToMany(() => Habitacione, (habitacion) => habitacion.hotel)
  habitaciones: Habitacione[];
}
