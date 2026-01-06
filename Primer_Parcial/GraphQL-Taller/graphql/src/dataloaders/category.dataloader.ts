import DataLoader from 'dataloader';
import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class CategoryDataLoader {
  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  createLoader(): DataLoader<number, Category> {
    return new DataLoader<number, Category>(async (ids: readonly number[]): Promise<(Category | Error)[]> => {
      const REST_API_URL = process.env.REST_API_URL || 'http://localhost:3000';
      
      const { data } = await firstValueFrom(
        this.httpService.get<Category[]>(`${REST_API_URL}/api/v1/categories`),
      );

      const categoryMap = new Map(
        data.map((category) => [category.id_category, category]),
      );

      return ids.map((id) => categoryMap.get(id) || new Error(`Category ${id} not found`)) as (Category | Error)[];
    });
  }
}
