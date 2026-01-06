import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Habitacione } from '../habitaciones/entities/habitacione.entity';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Habitacione)
    private readonly habitacionRepository: Repository<Habitacione>,
  ) {}

  validarFechas(fecha_inicio: Date, fecha_fin: Date): boolean {
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    
    if (fin <= inicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }
    return true;
  }

  validarFechasNoEnPasado(fecha_inicio: Date): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicio = new Date(fecha_inicio);
    inicio.setHours(0, 0, 0, 0);
    
    if (inicio < hoy) {
      throw new BadRequestException('No se pueden hacer reservas con fecha de inicio en el pasado');
    }
    return true;
  }

  async validarDisponibilidad(habitacion_id: number, fecha_inicio: Date, fecha_fin: Date, reserva_id_actual?: number): Promise<boolean> {
    const reservasExistentes = await this.reservaRepository
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.habitacion', 'habitacion')
      .where('habitacion.id = :habitacion_id', { habitacion_id })
      .andWhere('reserva.estado != :estado', { estado: 'cancelada' })
      .andWhere('reserva.id != :reserva_id', { reserva_id: reserva_id_actual || 0 })
      .getMany();

    const hayConflicto = reservasExistentes.some((r: any) => {
      const inicioExistente = new Date(r.fecha_inicio);
      const finExistente = new Date(r.fecha_fin);
      const inicioNueva = new Date(fecha_inicio);
      const finNueva = new Date(fecha_fin);
      
      return (
        (inicioNueva >= inicioExistente && inicioNueva < finExistente) ||
        (finNueva > inicioExistente && finNueva <= finExistente) ||
        (inicioNueva <= inicioExistente && finNueva >= finExistente)
      );
    });

    if (hayConflicto) {
      throw new BadRequestException('La habitación no está disponible en las fechas seleccionadas');
    }
    
    return true;
  }

  validarEstado(estado: string): boolean {
    const estadosValidos = ['pendiente', 'confirmada', 'cancelada'];
    if (!estadosValidos.includes(estado)) {
      throw new BadRequestException(`El estado debe ser uno de: ${estadosValidos.join(', ')}`);
    }
    return true;
  }

  calcularTotal(fecha_inicio: Date, fecha_fin: Date, precio_noche: number = 100): number {
    const inicio = new Date(fecha_inicio);
    const fin = new Date(fecha_fin);
    const noches = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
    return precio_noche * noches;
  }

  async create(createReservaDto: CreateReservaDto) {
    this.validarFechas(createReservaDto.fecha_inicio, createReservaDto.fecha_fin);
    this.validarFechasNoEnPasado(createReservaDto.fecha_inicio);
    
    // Validar que el cliente existe
    const cliente = await this.clienteRepository.findOne({
      where: { id: createReservaDto.cliente_id },
    });
    if (!cliente) {
      throw new BadRequestException(`Cliente con ID ${createReservaDto.cliente_id} no existe`);
    }
    
    // Validar que la habitación existe
    const habitacion = await this.habitacionRepository.findOne({
      where: { id: createReservaDto.habitacion_id },
    });
    if (!habitacion) {
      throw new BadRequestException(`Habitación con ID ${createReservaDto.habitacion_id} no existe`);
    }
    
    await this.validarDisponibilidad(
      createReservaDto.habitacion_id,
      createReservaDto.fecha_inicio,
      createReservaDto.fecha_fin
    );

    if (createReservaDto.estado) {
      this.validarEstado(createReservaDto.estado);
    }

    const total = createReservaDto.total || this.calcularTotal(
      createReservaDto.fecha_inicio,
      createReservaDto.fecha_fin,
      Number(habitacion.precio)
    );

    const reserva = this.reservaRepository.create({
      ...createReservaDto,
      cliente: cliente,
      habitacion: habitacion,
      total,
      estado: createReservaDto.estado || 'pendiente',
    });
    
    return await this.reservaRepository.save(reserva);
  }

  async findAll() {
    return await this.reservaRepository.find({ relations: ['cliente', 'habitacion'] });
  }

  async findOne(id: number) {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: ['cliente', 'habitacion'],
    });
    
    if (!reserva) {
      throw new NotFoundException(`Reserva con ID ${id} no encontrada`);
    }
    
    return reserva;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    const reserva = await this.findOne(id);

    if ((updateReservaDto as any).fecha_inicio || (updateReservaDto as any).fecha_fin) {
      const fechaInicio = (updateReservaDto as any).fecha_inicio || reserva.fecha_inicio;
      const fechaFin = (updateReservaDto as any).fecha_fin || reserva.fecha_fin;
      
      this.validarFechas(fechaInicio, fechaFin);
      await this.validarDisponibilidad(
        reserva.habitacion.id,
        fechaInicio,
        fechaFin,
        id
      );
    }

    if ((updateReservaDto as any).estado) {
      this.validarEstado((updateReservaDto as any).estado);
    }

    Object.assign(reserva, updateReservaDto);
    return await this.reservaRepository.save(reserva);
  }

  async remove(id: number) {
    const reserva = await this.findOne(id);
    await this.reservaRepository.remove(reserva);
    return { mensaje: `Reserva con ID ${id} eliminada exitosamente` };
  }

  // Endpoint especializado: Confirmar reserva
  async confirmar(id: number) {
    const reserva = await this.findOne(id);

    if (reserva.estado === 'cancelada') {
      throw new BadRequestException('No se puede confirmar una reserva cancelada');
    }

    reserva.estado = 'confirmada';
    return await this.reservaRepository.save(reserva);
  }

  // Endpoint especializado: Cancelar reserva
  async cancelar(id: number) {
    const reserva = await this.findOne(id);
    reserva.estado = 'cancelada';
    return await this.reservaRepository.save(reserva);
  }

  // Endpoint especializado: Buscar reservas por cliente
  async findByCliente(cliente_id: number) {
    return await this.reservaRepository.find({
      where: { cliente: { id: cliente_id } },
      relations: ['cliente', 'habitacion'],
    });
  }

  // Endpoint especializado: Buscar reservas por habitación
  async findByHabitacion(habitacion_id: number) {
    return await this.reservaRepository.find({
      where: { habitacion: { id: habitacion_id } },
      relations: ['cliente', 'habitacion'],
    });
  }
}
