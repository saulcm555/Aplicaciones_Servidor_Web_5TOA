import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Category } from '../categories/entities/category.entity';

@Resolver(() => Category)
export class CategoryQueriesResolver {
  private readonly REST_API_URL = process.env.REST_API_URL || 'http://localhost:3000';

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  @Query(() => [Category], { name: 'categories' })
  async findAll(): Promise<Category[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Category[]>(`${this.REST_API_URL}/api/v1/categories`),
    );
    return data;
  }

  @Query(() => Category, { name: 'category', nullable: true })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Category> {
    const { data } = await firstValueFrom(
      this.httpService.get<Category>(`${this.REST_API_URL}/api/v1/categories/${id}`),
    );
    return data;
  }
}
