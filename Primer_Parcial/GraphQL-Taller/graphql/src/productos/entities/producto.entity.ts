import { ObjectType, Field, Int, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { Seller } from '../../sellers/entities/seller.entity';
import { Category } from '../../categories/entities/category.entity';
import { SubCategory } from '../../subcategories/entities/subcategory.entity';
import { ProductCart } from '../../product-carts/entities/product-cart.entity';
import { ProductOrder } from '../../product-orders/entities/product-order.entity';
import { SubcategoryProduct } from '../../subcategory-products/entities/subcategory-product.entity';

@ObjectType()
export class Producto {
  @Field(() => Int, { description: 'Product ID' })
  id_product: number;

  @Field(() => Int, { nullable: true, description: 'Seller ID' })
  id_seller?: number;

  @Field(() => Int, { nullable: true, description: 'Category ID' })
  id_category?: number;

  @Field(() => Int, { nullable: true, description: 'SubCategory ID' })
  id_sub_category?: number;

  @Field({ description: 'Product name' })
  product_name: string;

  @Field({ nullable: true, description: 'Product description' })
  description?: string;

  @Field(() => Float, { description: 'Product price' })
  price: number;

  @Field(() => Int, { description: 'Available stock' })
  stock: number;

  @Field({ nullable: true, description: 'Product photo URL' })
  photo?: string;

  @Field(() => GraphQLISODateTime, { description: 'Creation date' })
  created_at: Date;

  @Field(() => Seller, { nullable: true, description: 'Seller of this product' })
  seller?: Seller;

  @Field(() => Category, { nullable: true, description: 'Category of this product' })
  category?: Category;

  @Field(() => SubCategory, { nullable: true, description: 'SubCategory of this product' })
  subCategory?: SubCategory;

  @Field(() => [ProductCart], { nullable: true, description: 'Carts containing this product' })
  productCarts?: ProductCart[];

  @Field(() => [ProductOrder], { nullable: true, description: 'Orders containing this product' })
  productOrders?: ProductOrder[];

  @Field(() => [SubcategoryProduct], { nullable: true, description: 'Subcategory associations' })
  subcategoryProducts?: SubcategoryProduct[];
}
