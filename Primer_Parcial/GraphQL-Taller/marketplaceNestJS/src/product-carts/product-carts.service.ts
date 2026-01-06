import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCartDto } from './dto/create-product-cart.dto';
import { UpdateProductCartDto } from './dto/update-product-cart.dto';
import { ProductCart } from './entities/product-cart.entity';

@Injectable()
export class ProductCartsService {
  constructor(
    @InjectRepository(ProductCart)
    private readonly productCartRepository: Repository<ProductCart>,
  ) {}

  async create(createProductCartDto: CreateProductCartDto): Promise<ProductCart> {
    const productCart = this.productCartRepository.create(createProductCartDto);
    return await this.productCartRepository.save(productCart);
  }

  async findAll(): Promise<ProductCart[]> {
    return await this.productCartRepository.find({
      relations: ['cart', 'product'],
    });
  }

  async findOne(id: number): Promise<ProductCart> {
    const productCart = await this.productCartRepository.findOne({
      where: { id_product_cart: id },
      relations: ['cart', 'product'],
    });
    
    if (!productCart) {
      throw new NotFoundException(`ProductCart with ID ${id} not found`);
    }
    
    return productCart;
  }

  async findByCart(cartId: number): Promise<ProductCart[]> {
    return await this.productCartRepository.find({
      where: { id_cart: cartId },
      relations: ['product'],
    });
  }

  async update(id: number, updateProductCartDto: UpdateProductCartDto): Promise<ProductCart> {
    const productCart = await this.findOne(id);
    Object.assign(productCart, updateProductCartDto);
    return await this.productCartRepository.save(productCart);
  }

  async remove(id: number): Promise<void> {
    const productCart = await this.findOne(id);
    await this.productCartRepository.remove(productCart);
  }

  async removeByCartAndProduct(cartId: number, productId: number): Promise<void> {
    const productCart = await this.productCartRepository.findOne({
      where: { id_cart: cartId, id_product: productId },
    });
    
    if (!productCart) {
      throw new NotFoundException(`ProductCart not found`);
    }
    
    await this.productCartRepository.remove(productCart);
  }
}
