import { Injectable, HttpException } from '@nestjs/common';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import axios from 'axios';

@Injectable()
export class ClientsService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/clients';

  async create(createClientInput: CreateClientInput) {
    try {
      // Mapear campos de GraphQL a REST API
      const payload = {
        client_name: createClientInput.name,
        client_email: createClientInput.email,
        client_password: createClientInput.password,
        phone: createClientInput.phone,
        address: createClientInput.address,
      };

      const response = await axios.post(this.REST_API_URL, payload);
      
      // Mapear respuesta de REST API a GraphQL
      return {
        id_client: response.data.id_client,
        client_name: response.data.client_name,
        client_email: response.data.client_email,
        phone: response.data.phone,
        address: response.data.address,
        created_at: response.data.created_at,
      };
    } catch (error) {
      console.error('❌ Error creating client:', error.response?.data);
      throw new HttpException(error.response?.data || 'Error creating client', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      console.log('📦 REST API Response:', JSON.stringify(response.data, null, 2));
      
      let clients = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        clients = response.data.data;
      } else if (Array.isArray(response.data)) {
        clients = response.data;
      }

      console.log('👥 Clients found:', clients.length);

      // Mapear cada cliente
      return clients.map(client => ({
        id_client: client.id_client,
        client_name: client.client_name,
        client_email: client.client_email,
        phone: client.phone,
        address: client.address,
        created_at: client.created_at,
      }));
    } catch (error) {
      console.error('❌ Error in findAll:', error.message);
      console.error('❌ Error response:', error.response?.data);
      throw new HttpException(error.response?.data || 'Error fetching clients', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      
      // Mapear respuesta
      return {
        id_client: response.data.id_client,
        client_name: response.data.client_name,
        client_email: response.data.client_email,
        phone: response.data.phone,
        address: response.data.address,
        created_at: response.data.created_at,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Client #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateClientInput: UpdateClientInput) {
    try {
      const { id: _, ...fields } = updateClientInput;
      
      // Mapear campos de GraphQL a REST API
      const payload: any = {};
      if (fields.name) payload.client_name = fields.name;
      if (fields.email) payload.client_email = fields.email;
      if (fields.password) payload.client_password = fields.password;
      if (fields.phone) payload.phone = fields.phone;
      if (fields.address) payload.address = fields.address;
      
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload);
      
      // Mapear respuesta
      return {
        id_client: response.data.id_client,
        client_name: response.data.client_name,
        client_email: response.data.client_email,
        phone: response.data.phone,
        address: response.data.address,
        created_at: response.data.created_at,
      };
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating client', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const client = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return client;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting client', error.response?.status || 500);
    }
  }
}
