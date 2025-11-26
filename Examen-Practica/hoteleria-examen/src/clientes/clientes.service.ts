import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  validarFormatoEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('El formato del email no es válido');
    }
    return true;
  }

  async validarEmailUnico(email: string, clienteIdActual?: number): Promise<boolean> {
    this.validarFormatoEmail(email);
    const existeEmail = await this.clienteRepository.findOne({
      where: { email },
    });
    if (existeEmail && existeEmail.id !== clienteIdActual) {
      throw new ConflictException(`El email ${email} ya está registrado`);
    }
    return true;
  }

  validarNombre(nombre: string): boolean {
    if (!nombre || nombre.trim().length === 0) {
      throw new BadRequestException('El nombre del cliente es obligatorio');
    }
    return true;
  }

  validarApellido(apellido: string): boolean {
    if (!apellido || apellido.trim().length === 0) {
      throw new BadRequestException('El apellido del cliente es obligatorio');
    }
    return true;
  }

  validarTelefono(telefono?: string): boolean {
    if (telefono && telefono.trim().length > 0) {
      const telefonoRegex = /^[0-9+\-\s()]{7,20}$/;
      if (!telefonoRegex.test(telefono)) {
        throw new BadRequestException('El formato del teléfono no es válido');
      }
    }
    return true;
  }

  async create(createClienteDto: CreateClienteDto) {
    this.validarNombre(createClienteDto.nombre);
    this.validarApellido(createClienteDto.apellido);
    await this.validarEmailUnico(createClienteDto.email);
    if (createClienteDto.telefono) {
      this.validarTelefono(createClienteDto.telefono);
    }

    const cliente = this.clienteRepository.create(createClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async findAll() {
    return await this.clienteRepository.find({ relations: ['reservas'] });
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: ['reservas'],
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);

    if ((updateClienteDto as any).nombre) {
      this.validarNombre((updateClienteDto as any).nombre);
    }
    if ((updateClienteDto as any).apellido) {
      this.validarApellido((updateClienteDto as any).apellido);
    }
    if ((updateClienteDto as any).email) {
      await this.validarEmailUnico((updateClienteDto as any).email, id);
    }
    if ((updateClienteDto as any).telefono) {
      this.validarTelefono((updateClienteDto as any).telefono);
    }

    Object.assign(cliente, updateClienteDto);
    return await this.clienteRepository.save(cliente);
  }

  async remove(id: number) {
    const cliente = await this.findOne(id);
    await this.clienteRepository.remove(cliente);
    return { mensaje: `Cliente con ID ${id} eliminado exitosamente` };
  }

  // Endpoint especializado: Obtener reservas de un cliente
  async getReservasByCliente(id: number) {
    const cliente = await this.findOne(id);
    return cliente.reservas || [];
  }

  // Endpoint especializado: Buscar cliente por email
  async findByEmail(email: string) {
    const cliente = await this.clienteRepository.findOne({
      where: { email },
      relations: ['reservas'],
    });
    
    if (!cliente) {
      throw new NotFoundException(`Cliente con email ${email} no encontrado`);
    }
    
    return cliente;
  }
}
