import { Injectable, HttpException } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import axios from 'axios';

@Injectable()
export class OrdersService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/orders';

  async create(createOrderInput: CreateOrderInput) {
    try {
      const response = await axios.post(this.REST_API_URL, createOrderInput);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error creating order', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      let orders = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        orders = response.data.data;
      } else if (Array.isArray(response.data)) {
        orders = response.data;
      }

      return orders.map(order => ({
        id_order: order.id_order,
        order_date: new Date(order.order_date),
        status: order.status,
        total_amount: order.total_amount,
        delivery_date: order.delivery_date,
        id_client: order.id_client,
        id_cart: order.id_cart,
        id_payment_method: order.id_payment_method,
        id_delivery: order.id_delivery,
        created_at: new Date(order.created_at),
      }));
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error fetching orders', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return {
        id_order: response.data.id_order,
        order_date: new Date(response.data.order_date),
        status: response.data.status,
        total_amount: response.data.total_amount,
        delivery_date: response.data.delivery_date,
        id_client: response.data.id_client,
        id_cart: response.data.id_cart,
        id_payment_method: response.data.id_payment_method,
        id_delivery: response.data.id_delivery,
        created_at: new Date(response.data.created_at),
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Order #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateOrderInput: UpdateOrderInput) {
    try {
      const { id: _, ...payload } = updateOrderInput;
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating order', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const order = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return order;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting order', error.response?.status || 500);
    }
  }
}
