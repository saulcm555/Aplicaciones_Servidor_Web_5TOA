import { Injectable, HttpException } from '@nestjs/common';
import { CreateCartInput } from './dto/create-cart.input';
import { UpdateCartInput } from './dto/update-cart.input';
import axios from 'axios';

@Injectable()
export class CartsService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/carts';

  async create(createCartInput: CreateCartInput) {
    try {
      const response = await axios.post(this.REST_API_URL, createCartInput);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error creating cart', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error fetching carts', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || `Cart #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateCartInput: UpdateCartInput) {
    try {
      const { id: _, ...payload } = updateCartInput;
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating cart', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const cart = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return cart;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting cart', error.response?.status || 500);
    }
  }
}
