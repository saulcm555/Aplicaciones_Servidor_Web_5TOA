import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { HabitacionesService } from './habitaciones.service';
import { CreateHabitacioneDto } from './dto/create-habitacione.dto';
import { UpdateHabitacioneDto } from './dto/update-habitacione.dto';

@Controller('habitaciones')
export class HabitacionesController {
  constructor(private readonly habitacionesService: HabitacionesService) {}

  @Post()
  create(@Body() createHabitacioneDto: CreateHabitacioneDto) {
    return this.habitacionesService.create(createHabitacioneDto);
  }

  @Get()
  findAll(@Query('hotel_id') hotel_id?: string) {
    if (hotel_id) {
      return this.habitacionesService.findByHotel(parseInt(hotel_id));
    }
    return this.habitacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHabitacioneDto: UpdateHabitacioneDto) {
    return this.habitacionesService.update(id, updateHabitacioneDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.habitacionesService.remove(id);
  }

  // Endpoint especializado: Verificar disponibilidad
  @Get(':id/disponibilidad')
  checkDisponibilidad(
    @Param('id', ParseIntPipe) id: number,
    @Query('fecha_inicio') fecha_inicio: string,
    @Query('fecha_fin') fecha_fin: string,
  ) {
    if (!fecha_inicio || !fecha_fin) {
      return {
        error: 'Se requieren los parámetros fecha_inicio y fecha_fin',
        ejemplo: '/habitaciones/1/disponibilidad?fecha_inicio=2024-12-01&fecha_fin=2024-12-05'
      };
    }
    return this.habitacionesService.checkDisponibilidad(id, fecha_inicio, fecha_fin);
  }
}

