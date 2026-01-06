import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    // Verificar que el email no esté duplicado
    const existingAdmin = await this.adminRepository.findOne({
      where: { admin_email: createAdminDto.admin_email },
    });

    if (existingAdmin) {
      throw new ConflictException(`Admin with email ${createAdminDto.admin_email} already exists`);
    }

    // Hash de la contraseña (opcional, pero recomendado para seguridad)
    const hashedPassword = await bcrypt.hash(createAdminDto.admin_password, 10);

    const admin = this.adminRepository.create({
      ...createAdminDto,
      admin_password: hashedPassword,
    });

    return await this.adminRepository.save(admin);
  }

  async findAll(): Promise<Admin[]> {
    return await this.adminRepository.find({
      select: ['id_admin', 'admin_name', 'admin_email', 'role', 'created_at'], // Excluir password
    });
  }

  async findOne(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id_admin: id },
      select: ['id_admin', 'admin_name', 'admin_email', 'role', 'created_at'], // Excluir password
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return admin;
  }

  async update(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id_admin: id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // Si se está actualizando el email, verificar que no esté duplicado
    if (updateAdminDto.admin_email && updateAdminDto.admin_email !== admin.admin_email) {
      const existingAdmin = await this.adminRepository.findOne({
        where: { admin_email: updateAdminDto.admin_email },
      });

      if (existingAdmin) {
        throw new ConflictException(`Admin with email ${updateAdminDto.admin_email} already exists`);
      }
    }

    // Si se está actualizando la contraseña, hashearla
    if (updateAdminDto.admin_password) {
      updateAdminDto.admin_password = await bcrypt.hash(updateAdminDto.admin_password, 10);
    }

    Object.assign(admin, updateAdminDto);
    return await this.adminRepository.save(admin);
  }

  async remove(id: number): Promise<void> {
    const admin = await this.adminRepository.findOne({
      where: { id_admin: id },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    await this.adminRepository.remove(admin);
  }

  // Método auxiliar para buscar por email (útil para autenticación)
  async findByEmail(email: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { admin_email: email },
    });
  }

  // Método auxiliar para validar contraseña (útil para autenticación)
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
