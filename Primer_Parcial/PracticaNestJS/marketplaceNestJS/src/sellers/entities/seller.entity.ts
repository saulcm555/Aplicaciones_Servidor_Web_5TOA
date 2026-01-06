import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Inventory } from '../../inventories/entities/inventory.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('seller')
export class Seller {
	@PrimaryGeneratedColumn('increment', { name: 'id_seller' })
	id_seller: number;

	@Column({ name: 'seller_name', type: 'varchar', length: 255 })
	seller_name: string;

	@Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
	email: string;

	@Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
	phone: string;

	@Column({ name: 'description', type: 'text', nullable: true })
	description: string;

	@CreateDateColumn({ name: 'created_at', type: 'datetime' })
	created_at: Date;

	// Relaciones
	@OneToMany(() => Inventory, (inventory) => inventory.seller)
	inventories: Inventory[];

	@OneToMany(() => Product, (product) => product.seller)
	products: Product[];
}
