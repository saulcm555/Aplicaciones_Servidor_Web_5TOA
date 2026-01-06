import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  @Get()
  findAll(
    @Query('cliente_id') cliente_id?: string,
    @Query('habitacion_id') habitacion_id?: string,
  ) {
    if (cliente_id) {
      return this.reservasService.findByCliente(parseInt(cliente_id));
    }
    if (habitacion_id) {
      return this.reservasService.findByHabitacion(parseInt(habitacion_id));
    }
    return this.reservasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(id, updateReservaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.remove(id);
  }

  // Endpoint especializado: Confirmar reserva
  @Patch(':id/confirmar')
  confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.confirmar(id);
  }

  // Endpoint especializado: Cancelar reserva
  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.cancelar(id);
  }
}

