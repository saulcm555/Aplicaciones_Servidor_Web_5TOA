import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriasDestinoDto } from './dto/create-categorias_destino.dto';
import { UpdateCategoriasDestinoDto } from './dto/update-categorias_destino.dto';
import { CategoriasDestino } from './entities/categorias_destino.entity';

@Injectable()
export class CategoriasDestinosService {
  constructor(
    @InjectRepository(CategoriasDestino)
    private readonly categoriaRepository: Repository<CategoriasDestino>,
  ) {}
  
  // Validación: Verificar que el nombre no esté vacío
  validarNombre(nombre: string): boolean {
    if (!nombre || nombre.trim().length === 0) {
      throw new BadRequestException('El nombre de la categoría es obligatorio');
    }
    return true;
  }

  // Validación: Verificar que la descripción no esté vacía
  validarDescripcion(descripcion: string): boolean {
    if (!descripcion || descripcion.trim().length === 0) {
      throw new BadRequestException('La descripción de la categoría es obligatoria');
    }
    return true;
  }

  async create(createCategoriasDestinoDto: CreateCategoriasDestinoDto) {
    this.validarNombre(createCategoriasDestinoDto.nombre);
    this.validarDescripcion(createCategoriasDestinoDto.descripcion);

    const categoria = this.categoriaRepository.create(createCategoriasDestinoDto);
    return await this.categoriaRepository.save(categoria);
  }

  async findAll() {
    return await this.categoriaRepository.find({ relations: ['destinos'] });
  }

  async findOne(id: number) {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['destinos'],
    });
    
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    
    return categoria;
  }

  async update(id: number, updateCategoriasDestinoDto: UpdateCategoriasDestinoDto) {
    const categoria = await this.findOne(id);

    if ((updateCategoriasDestinoDto as any).nombre) {
      this.validarNombre((updateCategoriasDestinoDto as any).nombre);
    }
    if ((updateCategoriasDestinoDto as any).descripcion) {
      this.validarDescripcion((updateCategoriasDestinoDto as any).descripcion);
    }
    
    Object.assign(categoria, updateCategoriasDestinoDto);
    return await this.categoriaRepository.save(categoria);
  }

  async remove(id: number) {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
    return { mensaje: `Categoría con ID ${id} eliminada exitosamente` };
  }

  // Endpoint especializado: Obtener destinos de una categoría
  async getDestinosByCategoria(id: number) {
    const categoria = await this.findOne(id);
    return categoria.destinos || [];
  }
}
