import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities/inventory.entity';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const inv = this.inventoryRepo.create(createInventoryDto as any);
    return await this.inventoryRepo.save(inv);
  }

  async findAll() {
    return await this.inventoryRepo.find({ relations: ['seller'] });
  }

  async findOne(id: number) {
    const inv = await this.inventoryRepo.findOne({ where: { id_inventory: id }, relations: ['seller'] });
    if (!inv) throw new NotFoundException(`Inventory with id ${id} not found`);
    return inv;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const inv = await this.inventoryRepo.preload({ id_inventory: id, ...(updateInventoryDto as any) });
    if (!inv) throw new NotFoundException(`Inventory with id ${id} not found`);
    return await this.inventoryRepo.save(inv);
  }

  async remove(id: number) {
    const inv = await this.inventoryRepo.findOne({ where: { id_inventory: id } });
    if (!inv) throw new NotFoundException(`Inventory with id ${id} not found`);
    await this.inventoryRepo.remove(inv);
    return { deleted: true };
  }

  async findBySeller(sellerId: number) {
    return await this.inventoryRepo.find({ where: { id_seller: sellerId }, relations: ['seller'] });
  }
}
