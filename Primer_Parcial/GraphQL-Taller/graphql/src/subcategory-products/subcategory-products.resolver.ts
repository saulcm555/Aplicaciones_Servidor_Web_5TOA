import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SubcategoryProductsService } from './subcategory-products.service';
import { SubcategoryProduct } from './entities/subcategory-product.entity';
import { CreateSubcategoryProductInput } from './dto/create-subcategory-product.input';
import { UpdateSubcategoryProductInput } from './dto/update-subcategory-product.input';
import { Producto } from '../productos/entities/producto.entity';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import axios from 'axios';

@Resolver(() => SubcategoryProduct)
export class SubcategoryProductsResolver {
  constructor(private readonly subcategoryProductsService: SubcategoryProductsService) {}

  @Query(() => [SubcategoryProduct], { name: 'subcategoryProducts' })
  findAll() {
    return this.subcategoryProductsService.findAll();
  }

  @Query(() => SubcategoryProduct, { name: 'subcategoryProduct' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subcategoryProductsService.findOne(id);
  }

  @Query(() => [SubcategoryProduct], { name: 'subcategoryProductsBySubcategory' })
  findBySubcategory(@Args('subcategoryId', { type: () => Int }) subcategoryId: number) {
    return this.subcategoryProductsService.findBySubcategory(subcategoryId);
  }

  @Query(() => [SubcategoryProduct], { name: 'subcategoryProductsByProduct' })
  findByProduct(@Args('productId', { type: () => Int }) productId: number) {
    return this.subcategoryProductsService.findByProduct(productId);
  }

  @ResolveField(() => Producto, { nullable: true })
  async product(@Parent() subcategoryProduct: SubcategoryProduct): Promise<Producto | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/products/${subcategoryProduct.id_product}`);
      return {
        id_product: response.data.id_product,
        id_seller: response.data.id_seller,
        id_category: response.data.id_category,
        id_sub_category: response.data.id_sub_category,
        product_name: response.data.product_name,
        description: response.data.description,
        price: response.data.price,
        stock: response.data.stock,
        photo: response.data.photo,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      console.error(`❌ Error fetching product for subcategory-product #${subcategoryProduct.id_subcategory_product}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => SubCategory, { nullable: true })
  async subcategory(@Parent() subcategoryProduct: SubcategoryProduct): Promise<SubCategory | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/subcategories/${subcategoryProduct.id_subcategory}`);
      return {
        id_sub_category: response.data.id_sub_category,
        sub_category_name: response.data.sub_category_name,
        description: response.data.description,
        id_category: response.data.id_category,
      };
    } catch (error) {
      console.error(`❌ Error fetching subcategory for subcategory-product #${subcategoryProduct.id_subcategory_product}:`, error.response?.data);
      return null;
    }
  }
}
