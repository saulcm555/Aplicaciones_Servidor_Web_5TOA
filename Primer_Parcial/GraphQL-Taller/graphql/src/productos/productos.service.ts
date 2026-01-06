import { Injectable, HttpException } from '@nestjs/common';
import { CreateProductoInput } from './dto/create-producto.input';
import { UpdateProductoInput } from './dto/update-producto.input';
import axios from 'axios';

@Injectable()
export class ProductosService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/products';

  async create(createProductoInput: CreateProductoInput) {
    try {
      // Transformar los datos asegurando que los números sean números
      const payload = {
        product_name: createProductoInput.product_name,
        description: createProductoInput.description,
        price: Number(createProductoInput.price),
        stock: Number(createProductoInput.stock),
        id_seller: createProductoInput.id_seller ? Number(createProductoInput.id_seller) : undefined,
        id_category: createProductoInput.id_category ? Number(createProductoInput.id_category) : undefined,
        id_sub_category: createProductoInput.id_sub_category ? Number(createProductoInput.id_sub_category) : undefined,
        photo: createProductoInput.photo,
      };
      
      // Eliminar propiedades undefined
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
      
      console.log('📤 Payload enviado a REST API:', JSON.stringify(payload, null, 2));
      
      const response = await axios.post(this.REST_API_URL, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error desde REST API:', error.response?.data);
      throw new HttpException(error.response?.data || 'Error creating product', error.response?.status || 500);
    }
  }

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      console.log('📥 Respuesta de REST API (findAll):', response.data);
      
      // Asegurarse de devolver un array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      
      // Si la respuesta tiene una propiedad que contiene el array
      if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      console.error('❌ La respuesta no es un array:', response.data);
      return [];
    } catch (error) {
      console.error('❌ Error fetching products:', error.response?.data);
      throw new HttpException(error.response?.data || 'Error fetching products', error.response?.status || 500);
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new HttpException(error.response?.data || `Product #${id} not found`, error.response?.status || 404);
    }
  }

  async update(id: number, updateProductoInput: UpdateProductoInput) {
    try {
      // Transformar los datos - solo incluir campos que fueron explícitamente enviados
      const payload: any = {};
      
      if (updateProductoInput.product_name !== undefined && updateProductoInput.product_name !== null) {
        payload.product_name = updateProductoInput.product_name;
      }
      if (updateProductoInput.description !== undefined && updateProductoInput.description !== null) {
        payload.description = updateProductoInput.description;
      }
      if (updateProductoInput.price !== undefined && updateProductoInput.price !== null) {
        payload.price = Number(updateProductoInput.price);
      }
      if (updateProductoInput.stock !== undefined && updateProductoInput.stock !== null && updateProductoInput.stock !== 0) {
        payload.stock = Number(updateProductoInput.stock);
      }
      if (updateProductoInput.id_seller !== undefined && updateProductoInput.id_seller !== null) {
        payload.id_seller = Number(updateProductoInput.id_seller);
      }
      if (updateProductoInput.id_category !== undefined && updateProductoInput.id_category !== null) {
        payload.id_category = Number(updateProductoInput.id_category);
      }
      if (updateProductoInput.id_sub_category !== undefined && updateProductoInput.id_sub_category !== null) {
        payload.id_sub_category = Number(updateProductoInput.id_sub_category);
      }
      if (updateProductoInput.photo !== undefined && updateProductoInput.photo !== null) {
        payload.photo = updateProductoInput.photo;
      }
      
      console.log('📤 Payload de actualización:', payload);
      
      const response = await axios.patch(`${this.REST_API_URL}/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating product:', error.response?.data);
      throw new HttpException(error.response?.data || 'Error updating product', error.response?.status || 500);
    }
  }

  async remove(id: number) {
    try {
      console.log('🗑️ Intentando eliminar producto con ID:', id);
      
      // Primero obtener el producto antes de eliminarlo
      const product = await this.findOne(id);
      console.log('✅ Producto encontrado:', product);
      
      // Luego eliminarlo
      const deleteUrl = `${this.REST_API_URL}/${id}`;
      console.log('🔗 URL de eliminación:', deleteUrl);
      const response = await axios.delete(deleteUrl);
      console.log('✅ Respuesta de eliminación:', response.data);
      
      // Retornar el producto que se eliminó
      return product;
    } catch (error) {
      console.error('❌ Error deleting product:', error.response?.data || error.message);
      throw new HttpException(error.response?.data || 'Error deleting product', error.response?.status || 500);
    }
  }
}
