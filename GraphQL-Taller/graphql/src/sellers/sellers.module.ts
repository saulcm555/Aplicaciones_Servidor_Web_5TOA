import { Module } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { SellersResolver } from './sellers.resolver';

@Module({
  providers: [SellersResolver, SellersService],
})
export class SellersModule {}
