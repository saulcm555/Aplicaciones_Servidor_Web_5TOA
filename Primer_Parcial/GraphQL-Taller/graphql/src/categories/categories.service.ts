import { Injectable, HttpException } from '@nestjs/common';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import axios from 'axios';

@Injectable()
export class CategoriesService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/categories';

  async create(createCategoryInput: CreateCategoryInput) {
    try {
      // Mapear campos de GraphQL a REST API
      const payload: any = {
        category_name: createCategoryInput.category_name,
      };
      if (createCategoryInput.description) {
        payload.category_description = createCategoryInput.description;
      }

      const response = await axios.post(this.REST_API_URL, payload);
      
      // Mapear respuesta de REST API a GraphQL
      return {
        id_category: response.data.id_category,
        category_name: response.data.category_name,
        description: response.data.category_description,
        category_photo: response.data.category_photo,
      };
    } catch (error) {
      console.error('❌ Error creating category:', error.response?.data);
      throw new HttpException(error.response?.data || 'Error creating category', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      let categories = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        categories = response.data.data;
      } else if (Array.isArray(response.data)) {
        categories = response.data;
      }

      // Mapear cada categoría
      return categories.map(cat => ({
        id_category: cat.id_category,
        category_name: cat.category_name,
        description: cat.category_description,
        category_photo: cat.category_photo,
      }));
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error fetching categories', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      
      // Mapear respuesta
      return {
        id_category: response.data.id_category,
        category_name: response.data.category_name,
        description: response.data.category_description,
        category_photo: response.data.category_photo,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Category #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput) {
    try {
      const { id: _, ...fields } = updateCategoryInput;
      
      // Mapear campos de GraphQL a REST API
      const payload: any = {};
      if (fields.category_name) payload.category_name = fields.category_name;
      if (fields.description) payload.category_description = fields.description;
      
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload);
      
      // Mapear respuesta
      return {
        id_category: response.data.id_category,
        category_name: response.data.category_name,
        description: response.data.category_description,
        category_photo: response.data.category_photo,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating category', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const category = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return category;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting category', error.response?.status || 500);
    }
  }
}
