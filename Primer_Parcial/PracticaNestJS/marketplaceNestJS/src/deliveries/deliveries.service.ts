import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Delivery } from './entities/delivery.entity';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const delivery = this.deliveryRepository.create(createDeliveryDto);
    return await this.deliveryRepository.save(delivery);
  }

  async findAll(): Promise<Delivery[]> {
    return await this.deliveryRepository.find({
      relations: ['orders', 'orders.client'],
    });
  }

  async findOne(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({
      where: { id_delivery: id },
      relations: ['orders', 'orders.client'],
    });
    
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    
    return delivery;
  }

  async findByOrder(orderId: number): Promise<Delivery[]> {
    const deliveries = await this.deliveryRepository.find({
      where: { orders: { id_order: orderId } },
      relations: ['orders'],
    });
    
    return deliveries;
  }

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.findOne(id);
    Object.assign(delivery, updateDeliveryDto);
    return await this.deliveryRepository.save(delivery);
  }

  async remove(id: number): Promise<void> {
    const delivery = await this.findOne(id);
    await this.deliveryRepository.remove(delivery);
  }
}
