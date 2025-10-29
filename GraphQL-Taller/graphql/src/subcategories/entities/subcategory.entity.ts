import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Category } from '../../categories/entities/category.entity';
import { SubcategoryProduct } from '../../subcategory-products/entities/subcategory-product.entity';

@ObjectType()
export class SubCategory {
  @Field(() => Int, { description: 'SubCategory ID' })
  id_sub_category: number;

  @Field({ description: 'SubCategory name' })
  sub_category_name: string;

  @Field({ nullable: true, description: 'SubCategory description' })
  description?: string;

  @Field(() => Int, { description: 'Category ID' })
  id_category: number;

  @Field(() => Category, { nullable: true, description: 'Related category' })
  category?: Category;

  @Field(() => [SubcategoryProduct], { nullable: true, description: 'Products in this subcategory' })
  subcategoryproducts?: SubcategoryProduct[];
}
