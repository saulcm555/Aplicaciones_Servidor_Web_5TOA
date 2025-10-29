import { Injectable, HttpException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AdminsService {
  private readonly REST_API_URL = 'http://localhost:3006/api/v1/admins';

  async findAll() {
    try {
      const response = await axios.get(this.REST_API_URL);
      let admins = [];
      
      // Manejar diferentes formatos de respuesta
      if (response.data && Array.isArray(response.data.data)) {
        admins = response.data.data;
      } else if (Array.isArray(response.data)) {
        admins = response.data;
      }

      // Los campos ya coinciden, mapear el array y convertir fecha
      return admins.map(admin => ({
        id_admin: admin.id_admin,
        admin_name: admin.admin_name,
        admin_email: admin.admin_email,
        admin_password: admin.admin_password,
        role: admin.role,
        created_at: new Date(admin.created_at),
      }));
    } catch (error) {
      console.error('❌ Error fetching admins:', error.response?.data);
      throw new HttpException(
        error.response?.data || 'Error fetching admins', 
        error.response?.status || 500
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.REST_API_URL}/${id}`);
      
      // Retornar la respuesta con los campos correctos y fecha convertida
      return {
        id_admin: response.data.id_admin,
        admin_name: response.data.admin_name,
        admin_email: response.data.admin_email,
        admin_password: response.data.admin_password,
        role: response.data.role,
        created_at: new Date(response.data.created_at),
      };
    } catch (error) {
      console.error(`❌ Error fetching admin #${id}:`, error.response?.data);
      throw new HttpException(
        error.response?.data || `Admin #${id} not found`, 
        error.response?.status || 404
      );
    }
  }
}
