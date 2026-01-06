import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinosService } from './destinos.service';
import { DestinosController } from './destinos.controller';
import { Destino } from './entities/destino.entity';
import { CategoriasDestinosModule } from '../categorias_destinos/categorias_destinos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Destino]),
    CategoriasDestinosModule,
  ],
  controllers: [DestinosController],
  providers: [DestinosService],
  exports: [DestinosService, TypeOrmModule],
})
export class DestinosModule {}
