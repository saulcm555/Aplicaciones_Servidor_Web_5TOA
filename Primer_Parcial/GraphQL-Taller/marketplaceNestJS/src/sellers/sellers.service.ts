import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { Seller } from './entities/seller.entity';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>,
  ) {}

  async create(createSellerDto: CreateSellerDto) {
    const seller = this.sellerRepository.create(createSellerDto as any);
    return await this.sellerRepository.save(seller);
  }

  async findAll() {
    return await this.sellerRepository.find({ relations: ['inventories', 'products'] });
  }

  async findOne(id: number) {
    const seller = await this.sellerRepository.findOne({ where: { id_seller: id }, relations: ['inventories', 'products'] });
    if (!seller) throw new NotFoundException(`Seller with id ${id} not found`);
    return seller;
  }

  async update(id: number, updateSellerDto: UpdateSellerDto) {
    const seller = await this.sellerRepository.preload({ id_seller: id, ...(updateSellerDto as any) });
    if (!seller) throw new NotFoundException(`Seller with id ${id} not found`);
    return await this.sellerRepository.save(seller);
  }

  async remove(id: number) {
    const seller = await this.sellerRepository.findOne({ where: { id_seller: id } });
    if (!seller) throw new NotFoundException(`Seller with id ${id} not found`);
    await this.sellerRepository.remove(seller);
    return { deleted: true };
  }
}
