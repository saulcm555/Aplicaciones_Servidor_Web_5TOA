import { Injectable, HttpException } from '@nestjs/common';
import { CreateSubcategoryProductInput } from './dto/create-subcategory-product.input';
import { UpdateSubcategoryProductInput } from './dto/update-subcategory-product.input';
import axios from 'axios';

@Injectable()
export class SubcategoryProductsService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/subcategory-products';

  async create(createSubcategoryProductInput: CreateSubcategoryProductInput) {
    try {
      const response = await axios.post(this.REST_API_URL, createSubcategoryProductInput);
      return {
        id_subcategory_product: response.data.id_subcategory_product,
        id_subcategory: response.data.id_subcategory,
        id_product: response.data.id_product,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error creating subcategory product', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
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
      throw new HttpException(error.response?.data || 'Error fetching subcategory products', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return {
        id_subcategory_product: response.data.id_subcategory_product,
        id_subcategory: response.data.id_subcategory,
        id_product: response.data.id_product,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Subcategory product #${id} not found`, error.response?.status || 404);
    }
  }

  async findBySubcategory(subcategoryId: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/subcategory/${subcategoryId}`);
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
      throw new HttpException(error.response?.data || `Subcategory products for subcategory #${subcategoryId} not found`, error.response?.status || 404);
    }
  }

  async findByProduct(productId: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/product/${productId}`);
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
      throw new HttpException(error.response?.data || `Subcategory products for product #${productId} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateSubcategoryProductInput: UpdateSubcategoryProductInput) {
    try {
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, updateSubcategoryProductInput);
      return {
        id_subcategory_product: response.data.id_subcategory_product,
        id_subcategory: response.data.id_subcategory,
        id_product: response.data.id_product,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating subcategory product', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const subcategoryProduct = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return subcategoryProduct;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting subcategory product', error.response?.status || 500);
    }
  }
}
