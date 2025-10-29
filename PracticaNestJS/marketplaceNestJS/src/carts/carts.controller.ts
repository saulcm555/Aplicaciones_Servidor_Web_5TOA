import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CartsService } from './carts.service';
import { ProductCartsService } from '../product-carts/product-carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateProductCartDto } from '../product-carts/dto/create-product-cart.dto';

@Controller('carts')
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly productCartsService: ProductCartsService,
  ) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartsService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartsService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartsService.remove(+id);
  }

  // Agregar producto al carrito
  @Post(':cartId/items')
  addItemToCart(
    @Param('cartId') cartId: string,
    @Body() body: { id_product: number; quantity: number },
  ) {
    const createProductCartDto: CreateProductCartDto = {
      id_cart: +cartId,
      id_product: body.id_product,
      quantity: body.quantity,
    };
    return this.productCartsService.create(createProductCartDto);
  }

  // Obtener items del carrito
  @Get(':cartId/items')
  getCartItems(@Param('cartId') cartId: string) {
    return this.productCartsService.findByCart(+cartId);
  }

  // Eliminar producto del carrito
  @Delete(':cartId/items/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeItemFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    return this.productCartsService.removeByCartAndProduct(+cartId, +productId);
  }
}
