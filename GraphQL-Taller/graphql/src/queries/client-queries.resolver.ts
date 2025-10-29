import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Client } from '../clients/entities/client.entity';

@Resolver(() => Client)
export class ClientQueriesResolver {
  private readonly REST_API_URL = process.env.REST_API_URL || 'http://localhost:3000';

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  @Query(() => [Client], { name: 'clients' })
  async findAll(): Promise<Client[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<Client[]>(`${this.REST_API_URL}/api/v1/clients`),
    );
    return data;
  }

  @Query(() => Client, { name: 'client', nullable: true })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Client> {
    const { data } = await firstValueFrom(
      this.httpService.get<Client>(`${this.REST_API_URL}/api/v1/clients/${id}`),
    );
    return data;
  }
}
