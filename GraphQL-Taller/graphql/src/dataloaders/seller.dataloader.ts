import DataLoader from 'dataloader';
import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Seller } from '../sellers/entities/seller.entity';

@Injectable()
export class SellerDataLoader {
  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  createLoader(): DataLoader<number, Seller> {
    return new DataLoader<number, Seller>(async (ids: readonly number[]): Promise<(Seller | Error)[]> => {
      const REST_API_URL = process.env.REST_API_URL || 'http://localhost:3000';
      
      const { data } = await firstValueFrom(
        this.httpService.get<Seller[]>(`${REST_API_URL}/api/v1/sellers`),
      );

      const sellerMap = new Map(
        data.map((seller) => [seller.id_seller, seller]),
      );

      return ids.map((id) => sellerMap.get(id) || new Error(`Seller ${id} not found`)) as (Seller | Error)[];
    });
  }
}
