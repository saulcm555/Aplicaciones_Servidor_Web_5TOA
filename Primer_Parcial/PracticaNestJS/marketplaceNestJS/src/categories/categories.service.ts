import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  // ==================== CATEGORY METHODS ====================

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['subCategories'],
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id_category: id },
      relations: ['subCategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  // ==================== SUBCATEGORY METHODS ====================

  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto): Promise<SubCategory> {
    // Validar que la categoría asociada exista
    await this.findOne(createSubCategoryDto.id_category);

    const subCategory = this.subCategoryRepository.create(createSubCategoryDto);
    return await this.subCategoryRepository.save(subCategory);
  }

  async findAllSubCategories(): Promise<SubCategory[]> {
    return await this.subCategoryRepository.find({
      relations: ['category'],
    });
  }

  async findOneSubCategory(id: number): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id_sub_category: id },
      relations: ['category'],
    });

    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }

    return subCategory;
  }

  async updateSubCategory(id: number, updateSubCategoryDto: UpdateSubCategoryDto): Promise<SubCategory> {
    const subCategory = await this.findOneSubCategory(id);

    // Si se está actualizando la categoría, validar que exista
    if (updateSubCategoryDto.id_category) {
      await this.findOne(updateSubCategoryDto.id_category);
    }

    Object.assign(subCategory, updateSubCategoryDto);
    return await this.subCategoryRepository.save(subCategory);
  }

  async removeSubCategory(id: number): Promise<void> {
    const subCategory = await this.findOneSubCategory(id);
    await this.subCategoryRepository.remove(subCategory);
  }

  // Método adicional: obtener subcategorías por categoría
  async findSubCategoriesByCategory(categoryId: number): Promise<SubCategory[]> {
    await this.findOne(categoryId); // Validar que la categoría exista
    return await this.subCategoryRepository.find({
      where: { id_category: categoryId },
      relations: ['category'],
    });
  }
}
