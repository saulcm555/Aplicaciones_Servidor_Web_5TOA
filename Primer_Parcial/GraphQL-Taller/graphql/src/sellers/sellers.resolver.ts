import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SellersService } from './sellers.service';
import { Seller } from './entities/seller.entity';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';
import { Inventory } from '../inventories/entities/inventory.entity';
import { Producto } from '../productos/entities/producto.entity';
import axios from 'axios';

@Resolver(() => Seller)
export class SellersResolver {
  constructor(private readonly sellersService: SellersService) {}

  @Query(() => [Seller], { name: 'sellers' })
  findAll() {
    return this.sellersService.findAll();
  }

  @Query(() => Seller, { name: 'seller' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.sellersService.findOne(id);
  }

  @ResolveField(() => [Inventory], { nullable: true })
  async inventories(@Parent() seller: Seller): Promise<Inventory[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/inventories/seller/${seller.id_seller}`);
      let inventories = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        inventories = response.data.data;
      } else if (Array.isArray(response.data)) {
        inventories = response.data;
      }

      return inventories.map(inv => ({
        id_inventory: inv.id_inventory,
        id_seller: inv.id_seller,
        location: inv.location,
        stock_total: inv.stock_total,
        created_at: inv.created_at ? new Date(inv.created_at) : null,
      }));
    } catch (error) {
      console.error(`❌ Error fetching inventories for seller #${seller.id_seller}:`, error.response?.data);
      return [];
    }
  }

  @ResolveField(() => [Producto], { nullable: true })
  async products(@Parent() seller: Seller): Promise<Producto[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/products/seller/${seller.id_seller}`);
      let products = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      }

      return products.map(prod => ({
        id_product: prod.id_product,
        id_seller: prod.id_seller,
        id_category: prod.id_category,
        id_sub_category: prod.id_sub_category,
        product_name: prod.product_name,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        photo: prod.photo,
        created_at: prod.created_at ? new Date(prod.created_at) : null,
      }));
    } catch (error) {
      console.error(`❌ Error fetching products for seller #${seller.id_seller}:`, error.response?.data);
      return [];
    }
  }
}
