import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';
import { Destino } from './entities/destino.entity';
import { CategoriasDestino } from '../categorias_destinos/entities/categorias_destino.entity';

@Injectable()
export class DestinosService {
  constructor(
    @InjectRepository(Destino)
    private readonly destinoRepository: Repository<Destino>,
    @InjectRepository(CategoriasDestino)
    private readonly categoriaRepository: Repository<CategoriasDestino>,
  ) {}

  validarCategoriaId(categoria_id: number): boolean {
    if (!categoria_id || categoria_id <= 0) {
      throw new BadRequestException('La categoría es obligatoria y debe ser un ID válido');
    }
    return true;
  }

  validarNombre(nombre: string): boolean {
    if (!nombre || nombre.trim().length === 0) {
      throw new BadRequestException('El nombre del destino es obligatorio');
    }
    return true;
  }

  async create(createDestinoDto: CreateDestinoDto) {
    this.validarNombre(createDestinoDto.nombre);
    this.validarCategoriaId(createDestinoDto.categoria_id);

    // Validar que la categoría existe
    const categoria = await this.categoriaRepository.findOne({
      where: { id: createDestinoDto.categoria_id },
    });
    
    if (!categoria) {
      throw new BadRequestException(`Categoría con ID ${createDestinoDto.categoria_id} no existe`);
    }

    const destino = this.destinoRepository.create({
      ...createDestinoDto,
      categoria: categoria,
    });
    return await this.destinoRepository.save(destino);
  }

  async findAll() {
    return await this.destinoRepository.find({ relations: ['categoria', 'hoteles'] });
  }

  async findOne(id: number) {
    const destino = await this.destinoRepository.findOne({
      where: { id },
      relations: ['categoria', 'hoteles'],
    });
    
    if (!destino) {
      throw new NotFoundException(`Destino con ID ${id} no encontrado`);
    }
    
    return destino;
  }

  async update(id: number, updateDestinoDto: UpdateDestinoDto) {
    const destino = await this.findOne(id);

    if ((updateDestinoDto as any).nombre) {
      this.validarNombre((updateDestinoDto as any).nombre);
    }
    if ((updateDestinoDto as any).categoria_id) {
      this.validarCategoriaId((updateDestinoDto as any).categoria_id);
      const categoria = await this.categoriaRepository.findOne({
        where: { id: (updateDestinoDto as any).categoria_id },
      });
      if (!categoria) {
        throw new BadRequestException(`Categoría con ID ${(updateDestinoDto as any).categoria_id} no existe`);
      }
      destino.categoria = categoria;
    }
    
    Object.assign(destino, updateDestinoDto);
    return await this.destinoRepository.save(destino);
  }

  async remove(id: number) {
    const destino = await this.findOne(id);
    await this.destinoRepository.remove(destino);
    return { mensaje: `Destino con ID ${id} eliminado exitosamente` };
  }

  // Endpoint especializado: Obtener hoteles de un destino
  async getHotelesByDestino(id: number) {
    const destino = await this.findOne(id);
    return destino.hoteles || [];
  }

  // Endpoint especializado: Buscar destinos por categoría
  async findByCategoria(categoria_id: number) {
    return await this.destinoRepository.find({
      where: { categoria: { id: categoria_id } },
      relations: ['categoria'],
    });
  }
}
