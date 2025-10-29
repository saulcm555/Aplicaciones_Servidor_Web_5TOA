import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartRepository.create({
      ...createCartDto,
      status: createCartDto.status || 'active',
    });
    return await this.cartRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return await this.cartRepository.find({
      relations: ['client', 'productCarts', 'productCarts.product'],
    });
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id_cart: id },
      relations: ['client', 'productCarts', 'productCarts.product'],
    });
    
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    
    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    Object.assign(cart, updateCartDto);
    return await this.cartRepository.save(cart);
  }

  async remove(id: number): Promise<void> {
    const cart = await this.findOne(id);
    await this.cartRepository.remove(cart);
  }

  async findByClient(clientId: number): Promise<Cart[]> {
    return await this.cartRepository.find({
      where: { id_client: clientId },
      relations: ['productCarts', 'productCarts.product'],
    });
  }
}
