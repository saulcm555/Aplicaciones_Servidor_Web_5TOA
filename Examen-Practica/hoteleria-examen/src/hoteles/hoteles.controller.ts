import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { HotelesService } from './hoteles.service';
import { CreateHoteleDto } from './dto/create-hotele.dto';
import { UpdateHoteleDto } from './dto/update-hotele.dto';

@Controller('hoteles')
export class HotelesController {
  constructor(private readonly hotelesService: HotelesService) {}

  @Post()
  create(@Body() createHoteleDto: CreateHoteleDto) {
    return this.hotelesService.create(createHoteleDto);
  }

  @Get()
  findAll(@Query('destino_id') destino_id?: string) {
    if (destino_id) {
      return this.hotelesService.findByDestino(parseInt(destino_id));
    }
    return this.hotelesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hotelesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateHoteleDto: UpdateHoteleDto) {
    return this.hotelesService.update(id, updateHoteleDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hotelesService.remove(id);
  }

  // Endpoint especializado: Obtener habitaciones de un hotel
  @Get(':id/habitaciones')
  getHabitaciones(@Param('id', ParseIntPipe) id: number) {
    return this.hotelesService.getHabitacionesByHotel(id);
  }
}

