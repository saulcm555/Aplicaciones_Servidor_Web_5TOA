import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitacionesService } from './habitaciones.service';
import { HabitacionesController } from './habitaciones.controller';
import { Habitacione } from './entities/habitacione.entity';
import { HotelesModule } from '../hoteles/hoteles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habitacione]),
    HotelesModule,
  ],
  controllers: [HabitacionesController],
  providers: [HabitacionesService],
  exports: [HabitacionesService, TypeOrmModule],
})
export class HabitacionesModule {}
