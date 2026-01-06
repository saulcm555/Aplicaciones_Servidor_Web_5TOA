import { Injectable, HttpException } from '@nestjs/common';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
import axios from 'axios';

@Injectable()
export class PaymentMethodsService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/payment-methods';

  async create(createPaymentMethodInput: CreatePaymentMethodInput) {
    try {
      const response = await axios.post(this.REST_API_URL, createPaymentMethodInput);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error creating payment method', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      let paymentMethods = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        paymentMethods = response.data.data;
      } else if (Array.isArray(response.data)) {
        paymentMethods = response.data;
      }

      return paymentMethods.map(pm => ({
        id_payment_method: pm.id_payment_method,
        method_name: pm.method_name,
        details_payment: pm.details_payment,
      }));
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error fetching payment methods', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return {
        id_payment_method: response.data.id_payment_method,
        method_name: response.data.method_name,
        details_payment: response.data.details_payment,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Payment method #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updatePaymentMethodInput: UpdatePaymentMethodInput) {
    try {
      const { id: _, ...payload } = updatePaymentMethodInput;
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating payment method', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const paymentMethod = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return paymentMethod;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting payment method', error.response?.status || 500);
    }
  }
}
