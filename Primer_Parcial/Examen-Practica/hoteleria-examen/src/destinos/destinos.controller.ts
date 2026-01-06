import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { DestinosService } from './destinos.service';
import { CreateDestinoDto } from './dto/create-destino.dto';
import { UpdateDestinoDto } from './dto/update-destino.dto';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly destinosService: DestinosService) {}

  @Post()
  create(@Body() createDestinoDto: CreateDestinoDto) {
    return this.destinosService.create(createDestinoDto);
  }

  @Get()
  findAll(@Query('categoria_id') categoria_id?: string) {
    if (categoria_id) {
      return this.destinosService.findByCategoria(parseInt(categoria_id));
    }
    return this.destinosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.destinosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDestinoDto: UpdateDestinoDto) {
    return this.destinosService.update(id, updateDestinoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.destinosService.remove(id);
  }

  // Endpoint especializado: Obtener hoteles de un destino
  @Get(':id/hoteles')
  getHoteles(@Param('id', ParseIntPipe) id: number) {
    return this.destinosService.getHotelesByDestino(id);
  }
}

