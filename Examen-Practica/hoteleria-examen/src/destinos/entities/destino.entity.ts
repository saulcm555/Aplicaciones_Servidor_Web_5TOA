import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CategoriasDestino } from '../../categorias_destinos/entities/categorias_destino.entity';
import { Hotele } from '../../hoteles/entities/hotele.entity';

@Entity('destinos')
export class Destino {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen_url: string;

  // Relación N:1 con CategoriaDestino
  @ManyToOne(() => CategoriasDestino, (categoria) => categoria.destinos, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriasDestino;

  // Relación 1:N con Hotel
  @OneToMany(() => Hotele, (hotel) => hotel.destino)
  hoteles: Hotele[];
}
