import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SellersService } from './sellers.service';
import { SellersController } from './sellers.controller';
import { Seller } from './entities/seller.entity';
import { InventoriesModule } from '../inventories/inventories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Seller]),
    InventoriesModule,
  ],
  controllers: [SellersController],
  providers: [SellersService],
  exports: [TypeOrmModule],
})
export class SellersModule {}
