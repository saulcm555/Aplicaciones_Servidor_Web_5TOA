import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { Category } from '../categories/entities/category.entity';
import { SubCategory } from '../categories/entities/sub-category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // Validate foreign keys if provided
    if (createProductDto.id_seller) {
      const seller = await this.sellerRepository.findOne({ where: { id_seller: createProductDto.id_seller } });
      if (!seller) throw new NotFoundException(`Seller with id ${createProductDto.id_seller} not found`);
    }
    if (createProductDto.id_category) {
      const category = await this.categoryRepository.findOne({ where: { id_category: createProductDto.id_category } });
      if (!category) throw new NotFoundException(`Category with id ${createProductDto.id_category} not found`);
    }
    if (createProductDto.id_sub_category) {
      const sub = await this.subCategoryRepository.findOne({ where: { id_sub_category: createProductDto.id_sub_category } });
      if (!sub) throw new NotFoundException(`SubCategory with id ${createProductDto.id_sub_category} not found`);
    }

    const product = this.productRepository.create(createProductDto as any);
    return await this.productRepository.save(product);
  }

  async findAll(query: {
    seller?: number;
    category?: number;
    subCategory?: number;
    minPrice?: number;
    maxPrice?: number;
    name?: string;
    limit?: number;
    offset?: number;
  }) {
    const qb = this.productRepository.createQueryBuilder('p');

    if (query.seller) qb.andWhere('p.id_seller = :seller', { seller: query.seller });
    if (query.category) qb.andWhere('p.id_category = :category', { category: query.category });
    if (query.subCategory) qb.andWhere('p.id_sub_category = :subCategory', { subCategory: query.subCategory });
    if (query.minPrice !== undefined) qb.andWhere('p.price >= :minPrice', { minPrice: query.minPrice });
    if (query.maxPrice !== undefined) qb.andWhere('p.price <= :maxPrice', { maxPrice: query.maxPrice });
    if (query.name) qb.andWhere('p.product_name ILIKE :name', { name: `%${query.name}%` });

    const limit = Math.min(query.limit ?? 10, 100);
    const offset = query.offset ?? 0;
    qb.take(limit).skip(offset);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, limit, offset };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id_product: id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({ id_product: id, ...(updateProductDto as any) });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id_product: id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    await this.productRepository.remove(product);
    return { deleted: true };
  }
}
