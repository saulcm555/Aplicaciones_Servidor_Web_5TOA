import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Seller } from '../sellers/entities/seller.entity';

@Resolver(() => Seller)
export class SellerQueriesResolver {
  private readonly REST_API_URL = process.env.REST_API_URL || 'http://localhost:3000';

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  @Query(() => [Seller], { name: 'sellers' })
  async findAll(): Promise<Seller[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Seller[]>(`${this.REST_API_URL}/api/v1/sellers`),
    );
    return data;
  }

  @Query(() => Seller, { name: 'seller', nullable: true })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Seller> {
    const { data } = await firstValueFrom(
      this.httpService.get<Seller>(`${this.REST_API_URL}/api/v1/sellers/${id}`),
    );
    return data;
  }
}
