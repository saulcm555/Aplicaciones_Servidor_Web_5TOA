import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SubCategoriesService } from './subcategories.service';
import { SubCategory } from './entities/subcategory.entity';
import { CreateSubCategoryInput } from './dto/create-subcategory.input';
import { UpdateSubCategoryInput } from './dto/update-subcategory.input';
import { Category } from '../categories/entities/category.entity';
import { SubcategoryProduct } from '../subcategory-products/entities/subcategory-product.entity';
import axios from 'axios';

@Resolver(() => SubCategory)
export class SubCategoriesResolver {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Query(() => [SubCategory], { name: 'subCategories', description: 'Get all subcategories' })
  findAll() {
    return this.subCategoriesService.findAll();
  }

  @Query(() => SubCategory, { name: 'subCategory', description: 'Get a subcategory by ID' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.subCategoriesService.findOne(id);
  }

  @Query(() => [SubCategory], { name: 'subCategoriesByCategory', description: 'Get subcategories by category ID' })
  findByCategory(@Args('categoryId', { type: () => Int }) categoryId: number) {
    return this.subCategoriesService.findByCategory(categoryId);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() subCategory: SubCategory): Promise<Category | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/categories/${subCategory.id_category}`);
      return {
        id_category: response.data.id_category,
        category_name: response.data.category_name,
        category_description: response.data.category_description,
        category_photo: response.data.category_photo,
      };
    } catch (error) {
      console.error(`❌ Error fetching category for subcategory #${subCategory.id_sub_category}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => [SubcategoryProduct], { nullable: true })
  async subcategoryproducts(@Parent() subCategory: SubCategory): Promise<SubcategoryProduct[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/subcategory-products/subcategory/${subCategory.id_sub_category}`);
      let subcategoryProducts = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        subcategoryProducts = response.data.data;
      } else if (Array.isArray(response.data)) {
        subcategoryProducts = response.data;
      }

      return subcategoryProducts.map(sp => ({
        id_subcategory_product: sp.id_subcategory_product,
        id_subcategory: sp.id_subcategory,
        id_product: sp.id_product,
        created_at: sp.created_at ? new Date(sp.created_at) : null,
      }));
    } catch (error) {
      console.error(`❌ Error fetching subcategory products for subcategory #${subCategory.id_sub_category}:`, error.response?.data);
      return [];
    }
  }
}
