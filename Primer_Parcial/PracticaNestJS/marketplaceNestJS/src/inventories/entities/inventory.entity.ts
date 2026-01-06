import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Seller } from '../../sellers/entities/seller.entity';

@Entity('inventory')
export class Inventory {
	@PrimaryGeneratedColumn('increment', { name: 'id_inventory' })
	id_inventory: number;

	@Column({ name: 'id_seller', type: 'int' })
	id_seller: number;

	@Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
	location: string;

	@Column({ name: 'stock_total', type: 'int', default: 0 })
	stock_total: number;

	@CreateDateColumn({ name: 'created_at', type: 'datetime' })
	created_at: Date;

	@ManyToOne(() => Seller, (seller) => seller.inventories)
	seller: Seller;
}
