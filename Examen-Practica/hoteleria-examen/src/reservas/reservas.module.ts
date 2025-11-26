import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { Reserva } from './entities/reserva.entity';
import { ClientesModule } from '../clientes/clientes.module';
import { HabitacionesModule } from '../habitaciones/habitaciones.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva]),
    ClientesModule,
    HabitacionesModule,
  ],
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService, TypeOrmModule],
})
export class ReservasModule {}
