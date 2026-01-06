import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHoteleDto } from './dto/create-hotele.dto';
import { UpdateHoteleDto } from './dto/update-hotele.dto';
import { Hotele } from './entities/hotele.entity';
import { Destino } from '../destinos/entities/destino.entity';

@Injectable()
export class HotelesService {
  constructor(
    @InjectRepository(Hotele)
    private readonly hotelRepository: Repository<Hotele>,
    @InjectRepository(Destino)
    private readonly destinoRepository: Repository<Destino>,
  ) {}

  validarDestinoId(destino_id: number): boolean {
    if (!destino_id || destino_id <= 0) {
      throw new BadRequestException('El destino es obligatorio y debe ser un ID válido');
    }
    return true;
  }

  validarNombre(nombre: string): boolean {
    if (!nombre || nombre.trim().length === 0) {
      throw new BadRequestException('El nombre del hotel es obligatorio');
    }
    return true;
  }

  validarDireccion(direccion: string): boolean {
    if (!direccion || direccion.trim().length === 0) {
      throw new BadRequestException('La dirección del hotel es obligatoria');
    }
    return true;
  }

  async create(createHoteleDto: CreateHoteleDto) {
    this.validarNombre(createHoteleDto.nombre);
    this.validarDestinoId(createHoteleDto.destino_id);
    this.validarDireccion(createHoteleDto.direccion);

    // Validar que el destino existe
    const destino = await this.destinoRepository.findOne({
      where: { id: createHoteleDto.destino_id },
    });
    
    if (!destino) {
      throw new BadRequestException(`Destino con ID ${createHoteleDto.destino_id} no existe`);
    }

    const hotel = this.hotelRepository.create({
      ...createHoteleDto,
      destino: destino,
    });
    return await this.hotelRepository.save(hotel);
  }

  async findAll() {
    return await this.hotelRepository.find({ relations: ['destino', 'habitaciones'] });
  }

  async findOne(id: number) {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: ['destino', 'habitaciones'],
    });
    
    if (!hotel) {
      throw new NotFoundException(`Hotel con ID ${id} no encontrado`);
    }
    
    return hotel;
  }

  async update(id: number, updateHoteleDto: UpdateHoteleDto) {
    const hotel = await this.findOne(id);

    if ((updateHoteleDto as any).nombre) {
      this.validarNombre((updateHoteleDto as any).nombre);
    }
    if ((updateHoteleDto as any).destino_id) {
      this.validarDestinoId((updateHoteleDto as any).destino_id);
      const destino = await this.destinoRepository.findOne({
        where: { id: (updateHoteleDto as any).destino_id },
      });
      if (!destino) {
        throw new BadRequestException(`Destino con ID ${(updateHoteleDto as any).destino_id} no existe`);
      }
      hotel.destino = destino;
    }
    if ((updateHoteleDto as any).direccion) {
      this.validarDireccion((updateHoteleDto as any).direccion);
    }
    
    Object.assign(hotel, updateHoteleDto);
    return await this.hotelRepository.save(hotel);
  }

  async remove(id: number) {
    const hotel = await this.findOne(id);
    await this.hotelRepository.remove(hotel);
    return { mensaje: `Hotel con ID ${id} eliminado exitosamente` };
  }

  // Endpoint especializado: Obtener habitaciones de un hotel
  async getHabitacionesByHotel(id: number) {
    const hotel = await this.findOne(id);
    return hotel.habitaciones || [];
  }

  // Endpoint especializado: Buscar hoteles por destino
  async findByDestino(destino_id: number) {
    return await this.hotelRepository.find({
      where: { destino: { id: destino_id } },
      relations: ['destino'],
    });
  }
}
