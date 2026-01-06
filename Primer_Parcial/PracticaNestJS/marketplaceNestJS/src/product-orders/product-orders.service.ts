import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductOrderDto } from './dto/create-product-order.dto';
import { UpdateProductOrderDto } from './dto/update-product-order.dto';
import { ProductOrder } from './entities/product-order.entity';

@Injectable()
export class ProductOrdersService {
  constructor(
    @InjectRepository(ProductOrder)
    private readonly productOrderRepository: Repository<ProductOrder>,
  ) {}

  async create(createProductOrderDto: CreateProductOrderDto): Promise<ProductOrder> {
    const productOrder = this.productOrderRepository.create(createProductOrderDto);
    return await this.productOrderRepository.save(productOrder);
  }

  async findAll(): Promise<ProductOrder[]> {
    return await this.productOrderRepository.find({
      relations: ['order', 'product'],
    });
  }

  async findOne(id: number): Promise<ProductOrder> {
    const productOrder = await this.productOrderRepository.findOne({
      where: { id_product_order: id },
      relations: ['order', 'product'],
    });
    
    if (!productOrder) {
      throw new NotFoundException(`ProductOrder with ID ${id} not found`);
    }
    
    return productOrder;
  }

  async findByOrder(orderId: number): Promise<ProductOrder[]> {
    return await this.productOrderRepository.find({
      where: { id_order: orderId },
      relations: ['product'],
    });
  }

  async update(id: number, updateProductOrderDto: UpdateProductOrderDto): Promise<ProductOrder> {
    const productOrder = await this.findOne(id);
    Object.assign(productOrder, updateProductOrderDto);
    return await this.productOrderRepository.save(productOrder);
  }

  async remove(id: number): Promise<void> {
    const productOrder = await this.findOne(id);
    await this.productOrderRepository.remove(productOrder);
  }
}
