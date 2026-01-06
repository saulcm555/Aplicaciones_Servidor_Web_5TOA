import { Injectable, HttpException } from '@nestjs/common';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
import axios from 'axios';

@Injectable()
export class InventoriesService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/inventories';

  async create(createInventoryInput: CreateInventoryInput) {
    try {
      const response = await axios.post(this.REST_API_URL, createInventoryInput);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error creating inventory', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      let inventories = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        inventories = response.data.data;
      } else if (Array.isArray(response.data)) {
        inventories = response.data;
      }

      return inventories.map(inventory => ({
        id_inventory: inventory.id_inventory,
        id_seller: inventory.id_seller,
        location: inventory.location,
        stock_total: inventory.stock_total,
        created_at: new Date(inventory.created_at),
      }));
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error fetching inventories', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return {
        id_inventory: response.data.id_inventory,
        id_seller: response.data.id_seller,
        location: response.data.location,
        stock_total: response.data.stock_total,
        created_at: new Date(response.data.created_at),
      };
    } catch (error) {
      throw new HttpException(error.response?.data || `Inventory #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateInventoryInput: UpdateInventoryInput) {
    try {
      const { id: _, ...payload } = updateInventoryInput;
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error updating inventory', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      const inventory = await this.findOne(id);
      await axios.delete(`${this.REST_API_URL}/${id}`);
      return inventory;
    } catch (error) {
      throw new HttpException(error.response?.data || 'Error deleting inventory', error.response?.status || 500);
    }
  }
}
