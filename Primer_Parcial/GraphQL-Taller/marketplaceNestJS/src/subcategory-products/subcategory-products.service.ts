import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubcategoryProductDto } from './dto/create-subcategory-product.dto';
import { UpdateSubcategoryProductDto } from './dto/update-subcategory-product.dto';
import { SubcategoryProduct } from './entities/subcategory-product.entity';

@Injectable()
export class SubcategoryProductsService {
  constructor(
    @InjectRepository(SubcategoryProduct)
    private readonly subcategoryProductRepository: Repository<SubcategoryProduct>,
  ) {}

  async create(createSubcategoryProductDto: CreateSubcategoryProductDto): Promise<SubcategoryProduct> {
    const subcategoryProduct = this.subcategoryProductRepository.create(createSubcategoryProductDto);
    return await this.subcategoryProductRepository.save(subcategoryProduct);
  }

  async findAll(): Promise<SubcategoryProduct[]> {
    return await this.subcategoryProductRepository.find({
      relations: ['subcategory', 'product'],
    });
  }

  async findOne(id: number): Promise<SubcategoryProduct> {
    const subcategoryProduct = await this.subcategoryProductRepository.findOne({
      where: { id_subcategory_product: id },
      relations: ['subcategory', 'product'],
    });
    
    if (!subcategoryProduct) {
      throw new NotFoundException(`SubcategoryProduct with ID ${id} not found`);
    }
    
    return subcategoryProduct;
  }

  async findBySubcategory(subcategoryId: number): Promise<SubcategoryProduct[]> {
    return await this.subcategoryProductRepository.find({
      where: { id_subcategory: subcategoryId },
      relations: ['product'],
    });
  }

  async findByProduct(productId: number): Promise<SubcategoryProduct[]> {
    return await this.subcategoryProductRepository.find({
      where: { id_product: productId },
      relations: ['subcategory'],
    });
  }

  async update(id: number, updateSubcategoryProductDto: UpdateSubcategoryProductDto): Promise<SubcategoryProduct> {
    const subcategoryProduct = await this.findOne(id);
    Object.assign(subcategoryProduct, updateSubcategoryProductDto);
    return await this.subcategoryProductRepository.save(subcategoryProduct);
  }

  async remove(id: number): Promise<void> {
    const subcategoryProduct = await this.findOne(id);
    await this.subcategoryProductRepository.remove(subcategoryProduct);
  }
}
