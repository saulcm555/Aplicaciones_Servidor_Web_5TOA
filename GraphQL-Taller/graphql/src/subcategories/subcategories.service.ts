import { Injectable, HttpException } from '@nestjs/common';
import { CreateSubCategoryInput } from './dto/create-subcategory.input';
import { UpdateSubCategoryInput } from './dto/update-subcategory.input';
import axios from 'axios';

@Injectable()
export class SubCategoriesService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/subcategories';

  async create(createSubCategoryInput: CreateSubCategoryInput) {
    try {
      const payload = {
        sub_category_name: createSubCategoryInput.sub_category_name,
        description: createSubCategoryInput.description,
        id_category: createSubCategoryInput.id_category,
      };

      const response = await axios.post(this.REST_API_URL, payload);
      
      return {
        id_sub_category: response.data.id_sub_category,
        sub_category_name: response.data.sub_category_name,
        description: response.data.description,
        id_category: response.data.id_category,
      };
    } catch (error) {
      console.error('❌ Error creating subcategory:', error.response?.data);
      throw new HttpException(
        error.response?.data || 'Error creating subcategory', 
        error.response?.status || 500
      );
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      let subcategories = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        subcategories = response.data.data;
      } else if (Array.isArray(response.data)) {
        subcategories = response.data;
      }

      return subcategories.map(subcat => ({
        id_sub_category: subcat.id_sub_category,
        sub_category_name: subcat.sub_category_name,
        description: subcat.description,
        id_category: subcat.id_category,
      }));
    } catch (error) {
      console.error('❌ Error fetching subcategories:', error.response?.data);
      throw new HttpException(
        error.response?.data || 'Error fetching subcategories', 
        error.response?.status || 500
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      
      return {
        id_sub_category: response.data.id_sub_category,
        sub_category_name: response.data.sub_category_name,
        description: response.data.description,
        id_category: response.data.id_category,
      };
    } catch (error) {
      console.error(`❌ Error fetching subcategory #${id}:`, error.response?.data);
      throw new HttpException(
        error.response?.data || `SubCategory #${id} not found`, 
        error.response?.status || 404
      );
    }
  }

  async update(id: number, updateSubCategoryInput: UpdateSubCategoryInput) {
    try {
      const { id_sub_category, ...fields } = updateSubCategoryInput;
      
      const payload: any = {};
      if (fields.sub_category_name !== undefined) payload.sub_category_name = fields.sub_category_name;
      if (fields.description !== undefined) payload.description = fields.description;
      if (fields.id_category !== undefined) payload.id_category = fields.id_category;
      
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload);
      
      return {
        id_sub_category: response.data.id_sub_category,
        sub_category_name: response.data.sub_category_name,
        description: response.data.description,
        id_category: response.data.id_category,
      };
    } catch (error) {
      console.error(`❌ Error updating subcategory #${id}:`, error.response?.data);
      throw new HttpException(
        error.response?.data || 'Error updating subcategory', 
        error.response?.status || 500
      );
    }
  }

  async remove(id: number) {
    try {
      const subcategory = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return subcategory;
    } catch (error) {
      console.error(`❌ Error deleting subcategory #${id}:`, error.response?.data);
      throw new HttpException(
        error.response?.data || 'Error deleting subcategory', 
        error.response?.status || 500
      );
    }
  }

  async findByCategory(categoryId: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/category/${categoryId}`);
      let subcategories = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        subcategories = response.data.data;
      } else if (Array.isArray(response.data)) {
        subcategories = response.data;
      }

      return subcategories.map(subcat => ({
        id_sub_category: subcat.id_sub_category,
        sub_category_name: subcat.sub_category_name,
        description: subcat.description,
        id_category: subcat.id_category,
      }));
    } catch (error) {
      console.error(`❌ Error fetching subcategories for category #${categoryId}:`, error.response?.data);
      throw new HttpException(
        error.response?.data || `Error fetching subcategories for category #${categoryId}`, 
        error.response?.status || 500
      );
    }
  }
}
