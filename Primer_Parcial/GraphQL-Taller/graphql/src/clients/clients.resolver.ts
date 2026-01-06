import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ClientsService } from './clients.service';
import { Client } from './entities/client.entity';
import { CreateClientInput } from './dto/create-client.input';
import { UpdateClientInput } from './dto/update-client.input';
import { Cart } from '../carts/entities/cart.entity';
import axios from 'axios';

@Resolver(() => Client)
export class ClientsResolver {
  constructor(private readonly clientsService: ClientsService) {}

  @Query(() => [Client], { name: 'clients' })
  findAll() {
    return this.clientsService.findAll();
  }

  @Query(() => Client, { name: 'client' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.clientsService.findOne(id);
  }

  @ResolveField(() => [Cart], { nullable: true })
  async carts(@Parent() client: Client): Promise<Cart[]> {
    try {
      // Obtener los carritos del cliente desde la REST API
      const response = await axios.get(`http://localhost:3006/api/v1/carts/client/${client.id_client}`);
      let carts = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        carts = response.data.data;
      } else if (Array.isArray(response.data)) {
        carts = response.data;
      }

      return carts.map(cart => ({
        id_cart: cart.id_cart,
        id_client: cart.id_client,
        status: cart.status,
        created_at: cart.created_at,
        updated_at: cart.updated_at,
      }));
    } catch (error) {
      console.error(`❌ Error fetching carts for client #${client.id_client}:`, error.response?.data);
      return [];
    }
  }
}
