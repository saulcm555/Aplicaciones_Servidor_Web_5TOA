import { Module } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { DeliveriesResolver } from './deliveries.resolver';

@Module({
  providers: [DeliveriesResolver, DeliveriesService],
})
export class DeliveriesModule {}
