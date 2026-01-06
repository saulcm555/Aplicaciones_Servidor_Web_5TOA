import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CategoriasDestinosService } from './categorias_destinos.service';
import { CreateCategoriasDestinoDto } from './dto/create-categorias_destino.dto';
import { UpdateCategoriasDestinoDto } from './dto/update-categorias_destino.dto';

@Controller('categorias-destinos')
export class CategoriasDestinosController {
  constructor(private readonly categoriasDestinosService: CategoriasDestinosService) {}

  @Post()
  create(@Body() createCategoriasDestinoDto: CreateCategoriasDestinoDto) {
    return this.categoriasDestinosService.create(createCategoriasDestinoDto);
  }

  @Get()
  findAll() {
    return this.categoriasDestinosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasDestinosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoriasDestinoDto: UpdateCategoriasDestinoDto) {
    return this.categoriasDestinosService.update(id, updateCategoriasDestinoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasDestinosService.remove(id);
  }

  // Endpoint especializado: Obtener destinos de una categoría
  @Get(':id/destinos')
  getDestinos(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasDestinosService.getDestinosByCategoria(id);
  }
}

