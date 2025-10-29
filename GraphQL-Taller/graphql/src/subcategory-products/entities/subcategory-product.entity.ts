import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Producto } from '../../productos/entities/producto.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';

@ObjectType()
export class SubcategoryProduct {
  @Field(() => Int, { description: 'Subcategory Product ID' })
  id_subcategory_product: number;

  @Field(() => Int, { description: 'Subcategory ID' })
  id_subcategory: number;

  @Field(() => Int, { description: 'Product ID' })
  id_product: number;

  @Field(() => GraphQLISODateTime, { description: 'Creation date' })
  created_at: Date;

  @Field(() => Producto, { nullable: true, description: 'Product associated' })
  product?: Producto;

  @Field(() => SubCategory, { nullable: true, description: 'Subcategory associated' })
  subcategory?: SubCategory;
}
