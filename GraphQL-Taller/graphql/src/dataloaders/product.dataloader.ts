import DataLoader from 'dataloader';
import { Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Producto } from '../productos/entities/producto.entity';

@Injectable()
export class ProductDataLoader {
  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  createLoader(): DataLoader<number, Producto> {
    return new DataLoader<number, Producto>(async (ids: readonly number[]): Promise<(Producto | Error)[]> => {
      const REST_API_URL = process.env.REST_API_URL || 'http://localhost:3000';
      
      // Obtener todos los productos en una sola llamada
      const { data } = await firstValueFrom(
        this.httpService.get<Producto[]>(`${REST_API_URL}/api/v1/products`),
      );

      // Crear un mapa de id -> producto
      const productMap = new Map(
        data.map((product) => [product.id_product, product]),
      );

      // Retornar productos en el mismo orden que los IDs solicitados
      return ids.map((id) => productMap.get(id) || new Error(`Product ${id} not found`)) as (Producto | Error)[];
    });
  }
}
