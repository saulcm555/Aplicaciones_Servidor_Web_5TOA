import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasDestinosService } from './categorias_destinos.service';
import { CategoriasDestinosController } from './categorias_destinos.controller';
import { CategoriasDestino } from './entities/categorias_destino.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriasDestino])],
  controllers: [CategoriasDestinosController],
  providers: [CategoriasDestinosService],
  exports: [CategoriasDestinosService, TypeOrmModule],
})
export class CategoriasDestinosModule {}
