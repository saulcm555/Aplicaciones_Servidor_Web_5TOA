import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProductCartsService } from './product-carts.service';
import { ProductCart } from './entities/product-cart.entity';
import { CreateProductCartInput } from './dto/create-product-cart.input';
import { UpdateProductCartInput } from './dto/update-product-cart.input';
import { Cart } from '../carts/entities/cart.entity';
import { Producto } from '../productos/entities/producto.entity';
import axios from 'axios';

@Resolver(() => ProductCart)
export class ProductCartsResolver {
  constructor(private readonly productCartsService: ProductCartsService) {}

  @Query(() => [ProductCart], { name: 'productCarts' })
  findAll() {
    return this.productCartsService.findAll();
  }

  @Query(() => ProductCart, { name: 'productCart' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productCartsService.findOne(id);
  }

  @Query(() => [ProductCart], { name: 'productCartsByCart' })
  findByCart(@Args('cartId', { type: () => Int }) cartId: number) {
    return this.productCartsService.findByCart(cartId);
  }

  @ResolveField(() => Cart, { nullable: true })
  async cart(@Parent() productCart: ProductCart): Promise<Cart | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/carts/${productCart.id_cart}`);
      return {
        id_cart: response.data.id_cart,
        id_client: response.data.id_client,
        status: response.data.status,
        created_at: new Date(response.data.created_at),
        updated_at: new Date(response.data.updated_at),
      };
    } catch (error) {
      console.error(`❌ Error fetching cart for product-cart #${productCart.id_product_cart}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => Producto, { nullable: true })
  async product(@Parent() productCart: ProductCart): Promise<Producto | null> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/products/${productCart.id_product}`);
      return {
        id_product: response.data.id_product,
        product_name: response.data.product_name,
        description: response.data.description,
        price: response.data.price,
        stock: response.data.stock,
        photo: response.data.photo,
        id_seller: response.data.id_seller,
        id_category: response.data.id_category,
        id_sub_category: response.data.id_sub_category,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      console.error(`❌ Error fetching product for product-cart #${productCart.id_product_cart}:`, error.response?.data);
      return null;
    }
  }
}
