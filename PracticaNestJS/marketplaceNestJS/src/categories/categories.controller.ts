import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe,
  HttpCode,
  HttpStatus 
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ==================== CATEGORY ENDPOINTS ====================

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }

  // ==================== SUBCATEGORY ENDPOINTS ====================

  // Obtener subcategorías de una categoría específica
  @Get(':categoryId/sub-categories')
  findSubCategoriesByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.findSubCategoriesByCategory(categoryId);
  }

  // Crear una subcategoría para una categoría específica
  @Post(':categoryId/sub-categories')
  @HttpCode(HttpStatus.CREATED)
  createSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
  ) {
    // Asegurar que el id_category del DTO coincida con el parámetro de la ruta
    createSubCategoryDto.id_category = categoryId;
    return this.categoriesService.createSubCategory(createSubCategoryDto);
  }

  // Obtener una subcategoría específica de una categoría
  @Get(':categoryId/sub-categories/:subCategoryId')
  findOneSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('subCategoryId', ParseIntPipe) subCategoryId: number,
  ) {
    // Se valida que la subcategoría pertenezca a la categoría en el servicio
    return this.categoriesService.findOneSubCategory(subCategoryId);
  }

  // Actualizar una subcategoría de una categoría
  @Patch(':categoryId/sub-categories/:subCategoryId')
  updateSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('subCategoryId', ParseIntPipe) subCategoryId: number,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    // Asegurar que el id_category del DTO coincida con el parámetro si se proporciona
    if (updateSubCategoryDto.id_category === undefined) {
      updateSubCategoryDto.id_category = categoryId;
    }
    return this.categoriesService.updateSubCategory(subCategoryId, updateSubCategoryDto);
  }

  // Eliminar una subcategoría de una categoría
  @Delete(':categoryId/sub-categories/:subCategoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSubCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Param('subCategoryId', ParseIntPipe) subCategoryId: number,
  ) {
    return this.categoriesService.removeSubCategory(subCategoryId);
  }
}
