import { Injectable } from '@nestjs/common';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dispositivo } from './entities/dispositivo.entity';

@Injectable()
export class DispositivosService {
  constructor(
    @InjectRepository(Dispositivo)
    private DispositivoRepository: Repository<Dispositivo>,
  ) {}

    async create(createDispositivoDto: CreateDispositivoDto) {
    const dispositivo = this.DispositivoRepository.create(createDispositivoDto);
    return await this.DispositivoRepository.save(dispositivo);
  }

  async findAll() {
    return this.DispositivoRepository.find();
  }

  async findOne(id: string) {
    const dispositivoEncontrado = await this.DispositivoRepository.findOneBy({id: id});
    if (!dispositivoEncontrado) {
      throw new Error(`Dispositivo con id ${id} no encontrado`);
    }
    return dispositivoEncontrado;
  }

  async update(id: string, updateDispositivoDto: UpdateDispositivoDto) {
    const dispositivoEncontrado = await this.DispositivoRepository.findOneBy({id: id});
    if (!dispositivoEncontrado) {
      throw new Error(`Dispositivo con id ${id} no encontrado`);
    }
    await this.DispositivoRepository.update(id, updateDispositivoDto);
    return `This action updates a #${id} dispositivo`;
  }

  async remove(id: string) {
    const dispositivoEncontrado = await this.DispositivoRepository.findOneBy({id: id});
    if (!dispositivoEncontrado) {
      throw new Error(`Dispositivo con id ${id} no encontrado`);
    }
    await this.DispositivoRepository.delete(id);
    return `This action removes a #${id} dispositivo`;
  }
}
