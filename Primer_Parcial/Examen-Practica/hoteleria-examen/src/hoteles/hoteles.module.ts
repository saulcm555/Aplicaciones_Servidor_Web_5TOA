import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelesService } from './hoteles.service';
import { HotelesController } from './hoteles.controller';
import { Hotele } from './entities/hotele.entity';
import { DestinosModule } from '../destinos/destinos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotele]),
    DestinosModule,
  ],
  controllers: [HotelesController],
  providers: [HotelesService],
  exports: [HotelesService, TypeOrmModule],
})
export class HotelesModule {}
