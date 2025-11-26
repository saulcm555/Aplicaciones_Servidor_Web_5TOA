import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHabitacioneDto } from './dto/create-habitacione.dto';
import { UpdateHabitacioneDto } from './dto/update-habitacione.dto';
import { Habitacione } from './entities/habitacione.entity';
import { Hotele } from '../hoteles/entities/hotele.entity';

@Injectable()
export class HabitacionesService {
  constructor(
    @InjectRepository(Habitacione)
    private readonly habitacionRepository: Repository<Habitacione>,
    @InjectRepository(Hotele)
    private readonly hotelRepository: Repository<Hotele>,
  ) {}

  validarHotelId(hotel_id: number): boolean {
    if (!hotel_id || hotel_id <= 0) {
      throw new BadRequestException('El hotel es obligatorio y debe ser un ID válido');
    }
    return true;
  }

  validarPrecio(precio: number): boolean {
    if (!precio || precio <= 0) {
      throw new BadRequestException('El precio debe ser mayor a 0');
    }
    return true;
  }

  validarCapacidad(capacidad: number): boolean {
    if (!capacidad || capacidad < 1) {
      throw new BadRequestException('La capacidad debe ser al menos 1 persona');
    }
    return true;
  }

  validarCategoria(categoria: string): boolean {
    if (!categoria || categoria.trim().length === 0) {
      throw new BadRequestException('La categoría de la habitación es obligatoria');
    }
    return true;
  }

  async create(createHabitacioneDto: CreateHabitacioneDto) {
    this.validarHotelId(createHabitacioneDto.hotel_id);
    this.validarPrecio(createHabitacioneDto.precio);
    this.validarCapacidad(createHabitacioneDto.capacidad);
    this.validarCategoria(createHabitacioneDto.categoria);

    // Validar que el hotel existe
    const hotel = await this.hotelRepository.findOne({
      where: { id: createHabitacioneDto.hotel_id },
    });
    
    if (!hotel) {
      throw new BadRequestException(`Hotel con ID ${createHabitacioneDto.hotel_id} no existe`);
    }

    const habitacion = this.habitacionRepository.create({
      ...createHabitacioneDto,
      hotel: hotel,
    });
    return await this.habitacionRepository.save(habitacion);
  }

  async findAll() {
    return await this.habitacionRepository.find({ relations: ['hotel', 'reservas'] });
  }

  async findOne(id: number) {
    const habitacion = await this.habitacionRepository.findOne({
      where: { id },
      relations: ['hotel', 'reservas'],
    });
    
    if (!habitacion) {
      throw new NotFoundException(`Habitación con ID ${id} no encontrada`);
    }
    
    return habitacion;
  }

  async update(id: number, updateHabitacioneDto: UpdateHabitacioneDto) {
    const habitacion = await this.findOne(id);

    if ((updateHabitacioneDto as any).precio) {
      this.validarPrecio((updateHabitacioneDto as any).precio);
    }
    if ((updateHabitacioneDto as any).capacidad) {
      this.validarCapacidad((updateHabitacioneDto as any).capacidad);
    }
    if ((updateHabitacioneDto as any).hotel_id) {
      this.validarHotelId((updateHabitacioneDto as any).hotel_id);
      const hotel = await this.hotelRepository.findOne({
        where: { id: (updateHabitacioneDto as any).hotel_id },
      });
      if (!hotel) {
        throw new BadRequestException(`Hotel con ID ${(updateHabitacioneDto as any).hotel_id} no existe`);
      }
      habitacion.hotel = hotel;
    }
    
    Object.assign(habitacion, updateHabitacioneDto);
    return await this.habitacionRepository.save(habitacion);
  }

  async remove(id: number) {
    const habitacion = await this.findOne(id);
    await this.habitacionRepository.remove(habitacion);
    return { mensaje: `Habitación con ID ${id} eliminada exitosamente` };
  }

  // Endpoint especializado: Verificar disponibilidad de habitación
  async checkDisponibilidad(id: number, fecha_inicio: string, fecha_fin: string) {
    const habitacion = await this.findOne(id);
    
    // Verificar si hay reservas que se solapen
    const reservas = habitacion.reservas || [];
    const disponible = !reservas.some((reserva: any) => {
      if (reserva.estado === 'cancelada') return false;
      
      const inicioReserva = new Date(reserva.fecha_inicio);
      const finReserva = new Date(reserva.fecha_fin);
      const inicioConsulta = new Date(fecha_inicio);
      const finConsulta = new Date(fecha_fin);
      
      return (
        (inicioConsulta >= inicioReserva && inicioConsulta < finReserva) ||
        (finConsulta > inicioReserva && finConsulta <= finReserva) ||
        (inicioConsulta <= inicioReserva && finConsulta >= finReserva)
      );
    });
    
    return {
      habitacion_id: id,
      disponible,
      mensaje: disponible 
        ? 'Habitación disponible para las fechas solicitadas' 
        : 'Habitación no disponible para las fechas solicitadas'
    };
  }

  // Endpoint especializado: Buscar habitaciones por hotel
  async findByHotel(hotel_id: number) {
    return await this.habitacionRepository.find({
      where: { hotel: { id: hotel_id } },
      relations: ['hotel'],
    });
  }
}
