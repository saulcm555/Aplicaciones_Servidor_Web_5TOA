import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Producto } from '../productos/entities/producto.entity';

@Resolver(() => Producto)
export class ProductQueriesResolver {
  private readonly REST_API_URL = process.env.REST_API_URL || 'http://localhost:3000';

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  @Query(() => [Producto], { name: 'products' })
  async findAll(): Promise<Producto[]> {
    const response = await firstValueFrom(
      this.httpService.get<{ data: Producto[] }>(`${this.REST_API_URL}/api/v1/products`),
    );
    // La API de products devuelve { data: [], total, limit, offset }
    return response.data.data || [];
  }

  @Query(() => Producto, { name: 'product', nullable: true })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Producto> {
    const { data } = await firstValueFrom(
      this.httpService.get<Producto>(`${this.REST_API_URL}/api/v1/products/${id}`),
    );
    return data;
  }

  @Query(() => [Producto], { name: 'productsByCategory' })
  async findByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<Producto[]> {
    const response = await firstValueFrom(
      this.httpService.get<{ data: Producto[] }>(
        `${this.REST_API_URL}/api/v1/products?id_category=${categoryId}`,
      ),
    );
    return response.data.data || [];
  }

  @Query(() => [Producto], { name: 'productsBySeller' })
  async findBySeller(
    @Args('sellerId', { type: () => Int }) sellerId: number,
  ): Promise<Producto[]> {
    const response = await firstValueFrom(
      this.httpService.get<{ data: Producto[] }>(
        `${this.REST_API_URL}/api/v1/products?id_seller=${sellerId}`,
      ),
    );
    return response.data.data || [];
  }
}
