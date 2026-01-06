import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn('increment', { name: 'id_admin' })
  id_admin: number;

  @Column({ name: 'admin_name', type: 'varchar', length: 100 })
  admin_name: string;

  @Column({ name: 'admin_email', type: 'varchar', unique: true })
  admin_email: string;

  @Column({ name: 'admin_password', type: 'varchar' })
  admin_password: string;

  @Column({ name: 'role', type: 'varchar', nullable: true })
  role: string;

  @CreateDateColumn({ 
    name: 'created_at', 
    type: 'datetime', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  created_at: Date;
}
