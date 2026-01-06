import { Injectable } from '@nestjs/common';
import { CreateDispositivoDto } from './dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from './dto/update-dispositivo.dto';
import { Dispositivo } from './entities/dispositivo.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { HttpService } from '@nestjs/axios';
const dispositivos:Dispositivo[]=[
  {
    id : '1',
    tipo : 'celular',
    nombre : 'tecno'
  },
  {
    id : '2',
    tipo : 'tablec',
    nombre : 'infiniti'
  },
  {
    id : '3',
    tipo : 'celular',
    nombre : 'ipone'
  }

]
@Injectable()
export class DispositivosService {
    constructor(private readonly httpService: HttpService) {}
  async create(createDispositivoDto: CreateDispositivoDto) { 
    const dispositivoNuevo = {id:(++dispositivos.length).toString(),...createDispositivoDto}
    dispositivos.push(dispositivoNuevo)
      await firstValueFrom(
      this.httpService.post('http://localhost:3001/app/notificaciones/crear-dispositivo', dispositivoNuevo).pipe(
        catchError((error: AxiosError) => {
          console.log(error.response?.data);
          throw 'An error happened!';
        }),
      ),
    );
    return dispositivoNuevo;
  }

  findAll() {
    return dispositivos;
  }

  findOne(id: number) {
    return `This action returns a #${id} dispositivo`;
  }

  update(id: number, updateDispositivoDto: UpdateDispositivoDto) {
    return `This action updates a #${id} dispositivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} dispositivo`;
  }
}
