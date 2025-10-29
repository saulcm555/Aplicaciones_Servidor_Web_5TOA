import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Dispositivo } from 'src/dispositivos/entities/dispositivo.entity';

@Injectable()
export class HttpServices{
  private readonly logger = new Logger(HttpServices.name);
  constructor(private readonly httpService: HttpService) {}

  async consultar_clientes(): Promise<Cliente[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Cliente[]>("http://localhost:3000/api/clientes").pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
  async consultar_cliente(id:string): Promise<Cliente> {
    const { data } = await firstValueFrom(
      this.httpService.get<Cliente>( `http://localhost:3000/api/clientes/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }

   async consultar_dispositivos(): Promise<Dispositivo[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Dispositivo[]>("http://localhost:3000/api/dispositivos").pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
  async consultar_dispositivo(id:string): Promise<Dispositivo> {
    const { data } = await firstValueFrom(
      this.httpService.get<Dispositivo>( `http://localhost:3000/api/dispositivos/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response?.data);
          throw 'An error happened!';
        }),
      ),
    );
    return data;
  }
}