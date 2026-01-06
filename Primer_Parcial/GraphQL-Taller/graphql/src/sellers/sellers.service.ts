import { Injectable, HttpException } from '@nestjs/common';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import axios from 'axios';

@Injectable()
export class SellersService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/sellers';

  async create(createSellerInput: CreateSellerInput) {
    try {
      // El payload ya debe venir con los campos correctos del REST API
      const response = await axios.post(this.REST_API_URL, createSellerInput, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      // Mapear respuesta de REST API a GraphQL
      return {
        id_seller: response.data.id_seller,
        seller_name: response.data.seller_name,
        email: response.data.email,
        phone: response.data.phone,
        description: response.data.description,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      console.error('❌ Error creating seller:', error.response?.data);
      throw new HttpException(error.response?.data || 'Error creating seller', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      let sellers = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        sellers = response.data.data;
      } else if (Array.isArray(response.data)) {
        sellers = response.data;
      }

      return sellers.map(seller => ({
        id_seller: seller.id_seller,
        seller_name: seller.seller_name,
        email: seller.email,
        phone: seller.phone,
        description: seller.description,
        created_at: seller.created_at ? new Date(seller.created_at) : null,
      }));
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error fetching sellers', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return {
        id_seller: response.data.id_seller,
        seller_name: response.data.seller_name,
        email: response.data.email,
        phone: response.data.phone,
        description: response.data.description,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Seller #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateSellerInput: UpdateSellerInput) {
    try {
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, updateSellerInput);
      return {
        id_seller: response.data.id_seller,
        seller_name: response.data.seller_name,
        email: response.data.email,
        phone: response.data.phone,
        description: response.data.description,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating seller', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const seller = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return seller;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting seller', error.response?.status || 500);
    }
  }
}
