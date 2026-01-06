import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Cart } from '../../carts/entities/cart.entity';
import { Producto } from '../../productos/entities/producto.entity';

@ObjectType()
export class ProductCart {
  @Field(() => Int, { description: 'Product Cart ID' })
  id_product_cart: number;

  @Field(() => Int, { description: 'Product ID' })
  id_product: number;

  @Field(() => Int, { description: 'Cart ID' })
  id_cart: number;

  @Field(() => Int, { description: 'Quantity' })
  quantity: number;

  @Field(() => GraphQLISODateTime, { description: 'Date when product was added to cart' })
  added_at: Date;

  @Field(() => Cart, { nullable: true, description: 'Cart associated with this product' })
  cart?: Cart;

  @Field(() => Producto, { nullable: true, description: 'Product in the cart' })
  product?: Producto;
}
