import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Dispositivo {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    nombre: string;
    @Column()   
    valor: number;
    @Column()
    tipo: string;
    @Column()
    estado: string;
}


