import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SubcategoryProduct } from 'src/subcategory-products/entities/subcategory-product.entity';
import { SubCategory } from 'src/subcategories/entities/subcategory.entity';

@ObjectType()
export class Category {
  @Field(() => Int, { description: 'Category ID' })
  id_category: number;

  @Field(()=> String, { description: 'Category name' })
  category_name: string;

  @Field(()=>String,{ description: 'Category description', nullable: true })
  category_description?: string;

  @Field(()=>String,{ nullable: true })
  category_photo?: string;

  @Field(() => [SubCategory], { description: 'Órdenes asociadas al carrito', nullable: true })
    orders?: SubCategory[];
}
