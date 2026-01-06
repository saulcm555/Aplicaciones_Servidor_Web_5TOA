import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { InventoriesService } from './inventories.service';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryInput } from './dto/create-inventory.input';
import { UpdateInventoryInput } from './dto/update-inventory.input';
import { Seller } from '../sellers/entities/seller.entity';
import axios from 'axios';

@Resolver(() => Inventory)
export class InventoriesResolver {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Query(() => [Inventory], { name: 'inventories' })
  findAll() {
    return this.inventoriesService.findAll();
  }

  @Query(() => Inventory, { name: 'inventory' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.inventoriesService.findOne(id);
  }

  @ResolveField(() => Seller, { nullable: true })
  async seller(@Parent() inventory: Inventory): Promise<Seller | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/sellers/${inventory.id_seller}`);
      return {
        id_seller: response.data.id_seller,
        seller_name: response.data.seller_name,
        email: response.data.email,
        phone: response.data.phone,
        description: response.data.description,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      console.error(`❌ Error fetching seller for inventory #${inventory.id_inventory}:`, error.response?.data);
      return null;
    }
  }
}
