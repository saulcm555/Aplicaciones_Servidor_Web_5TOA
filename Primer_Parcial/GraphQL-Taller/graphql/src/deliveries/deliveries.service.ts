import { Injectable, HttpException } from '@nestjs/common';
import { CreateDeliveryInput } from './dto/create-delivery.input';
import { UpdateDeliveryInput } from './dto/update-delivery.input';
import axios from 'axios';

@Injectable()
export class DeliveriesService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/deliveries';

  async create(createDeliveryInput: CreateDeliveryInput) {
    try {
      const response = await axios.post(this.REST_API_URL, createDeliveryInput);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error creating delivery', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      let deliveries = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        deliveries = response.data.data;
      } else if (Array.isArray(response.data)) {
        deliveries = response.data;
      }

      return deliveries.map(delivery => ({
        id_delivery: delivery.id_delivery,
        id_product: delivery.id_product,
        delivery_address: delivery.delivery_address,
        city: delivery.city,
        status: delivery.status,
        estimated_time: delivery.estimated_time ? new Date(delivery.estimated_time) : null,
        delivery_person: delivery.delivery_person,
        delivery_cost: delivery.delivery_cost,
        created_at: new Date(delivery.created_at),
      }));
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error fetching deliveries', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return {
        id_delivery: response.data.id_delivery,
        id_product: response.data.id_product,
        delivery_address: response.data.delivery_address,
        city: response.data.city,
        status: response.data.status,
        estimated_time: response.data.estimated_time ? new Date(response.data.estimated_time) : null,
        delivery_person: response.data.delivery_person,
        delivery_cost: response.data.delivery_cost,
        created_at: new Date(response.data.created_at),
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Delivery #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateDeliveryInput: UpdateDeliveryInput) {
    try {
      const { id: _, ...payload } = updateDeliveryInput;
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating delivery', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const delivery = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return delivery;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting delivery', error.response?.status || 500);
    }
  }
}
