import { Injectable, HttpException } from '@nestjs/common';
import { CreateProductOrderInput } from './dto/create-product-order.input';
import { UpdateProductOrderInput } from './dto/update-product-order.input';
import axios from 'axios';

@Injectable()
export class ProductOrdersService {
  private readonly REST_API_URL = 'http://localhost:3000/api/v1/product-orders';

  async create(createProductOrderInput: CreateProductOrderInput) {
    try {
      const response = await axios.post(this.REST_API_URL, createProductOrderInput);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error creating product order', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error fetching product orders', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || `Product order #${id} not found`, error.response?.status || 404);
    }
  }

  async findByOrder(orderId: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || `Product orders for order #${orderId} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateProductOrderInput: UpdateProductOrderInput) {
    try {
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, updateProductOrderInput);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating product order', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const response = await axios.delete(`${this.REST_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting product order', error.response?.status || 500);
    }
  }
}
