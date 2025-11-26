import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Destino } from '../../destinos/entities/destino.entity';

@Entity('categorias_destinos')
export class CategoriasDestino {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  // Relación 1:N con Destino
  @OneToMany(() => Destino, (destino) => destino.categoria)
  destinos: Destino[];
}
