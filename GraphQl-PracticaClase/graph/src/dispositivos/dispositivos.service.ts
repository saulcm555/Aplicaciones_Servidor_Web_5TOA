import { Injectable } from '@nestjs/common';
import { CreateDispositivoInput } from './dto/create-dispositivo.input';
import { UpdateDispositivoInput } from './dto/update-dispositivo.input';

@Injectable()
export class DispositivosService {
  create(createDispositivoInput: CreateDispositivoInput) {
    return 'This action adds a new dispositivo';
  }

  findAll() {
    return `This action returns all dispositivos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dispositivo`;
  }

  update(id: number, updateDispositivoInput: UpdateDispositivoInput) {
    return `This action updates a #${id} dispositivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} dispositivo`;
  }
}
