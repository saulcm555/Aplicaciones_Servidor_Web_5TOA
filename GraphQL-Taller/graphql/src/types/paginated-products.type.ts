import { ObjectType, Field } from '@nestjs/graphql';
import { Producto } from '../productos/entities/producto.entity';
import { PaginationMeta } from './pagination.type';

@ObjectType()
export class PaginatedProducts {
  @Field(() => [Producto])
  data: Producto[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
