import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { ProductosService } from './productos.service';
import { Producto } from './entities/producto.entity';
import { CreateProductoInput } from './dto/create-producto.input';
import { UpdateProductoInput } from './dto/update-producto.input';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Seller } from '../sellers/entities/seller.entity';
import { Category } from '../categories/entities/category.entity';
import { SubCategory } from '../subcategories/entities/subcategory.entity';
import { ProductCart } from '../product-carts/entities/product-cart.entity';
import { ProductOrder } from '../product-orders/entities/product-order.entity';
import { SubcategoryProduct } from '../subcategory-products/entities/subcategory-product.entity';
import axios from 'axios';

@Resolver(() => Producto)
export class ProductosResolver {
  constructor(private readonly productosService: ProductosService) {}

  @Query(() => [Producto], { name: 'productos' })
  findAll() {
    return this.productosService.findAll();
  }

  @Query(() => Producto, { name: 'producto' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.productosService.findOne(id);
  }

  @ResolveField(() => Seller, { nullable: true })
  async seller(@Parent() producto: Producto): Promise<Seller | null> {
    if (!producto.id_seller) return null;
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/sellers/${producto.id_seller}`);
      return {
        id_seller: response.data.id_seller,
        seller_name: response.data.seller_name,
        email: response.data.email,
        phone: response.data.phone,
        description: response.data.description,
        created_at: response.data.created_at ? new Date(response.data.created_at) : null,
      };
    } catch (error) {
      console.error(`❌ Error fetching seller for product #${producto.id_product}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() producto: Producto): Promise<Category | null> {
    if (!producto.id_category) return null;
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/categories/${producto.id_category}`);
      return {
        id_category: response.data.id_category,
        category_name: response.data.category_name,
        category_description: response.data.category_description,
        category_photo: response.data.category_photo,
      };
    } catch (error) {
      console.error(`❌ Error fetching category for product #${producto.id_product}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => SubCategory, { nullable: true })
  async subCategory(@Parent() producto: Producto): Promise<SubCategory | null> {
    if (!producto.id_sub_category) return null;
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/subcategories/${producto.id_sub_category}`);
      return {
        id_sub_category: response.data.id_sub_category,
        id_category: response.data.id_category,
        sub_category_name: response.data.sub_category_name,
        description: response.data.description,
      };
    } catch (error) {
      console.error(`❌ Error fetching subcategory for product #${producto.id_product}:`, error.response?.data);
      return null;
    }
  }

  @ResolveField(() => [ProductCart], { nullable: true })
  async productCarts(@Parent() producto: Producto): Promise<ProductCart[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/product-carts/product/${producto.id_product}`);
      let productCarts = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        productCarts = response.data.data;
      } else if (Array.isArray(response.data)) {
        productCarts = response.data;
      }

      return productCarts.map(pc => ({
        id_product_cart: pc.id_product_cart,
        id_product: pc.id_product,
        id_cart: pc.id_cart,
        quantity: pc.quantity,
        added_at: pc.added_at ? new Date(pc.added_at) : null,
      }));
    } catch (error) {
      console.error(`❌ Error fetching product carts for product #${producto.id_product}:`, error.response?.data);
      return [];
    }
  }

  @ResolveField(() => [ProductOrder], { nullable: true })
  async productOrders(@Parent() producto: Producto): Promise<ProductOrder[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/product-orders/product/${producto.id_product}`);
      let productOrders = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        productOrders = response.data.data;
      } else if (Array.isArray(response.data)) {
        productOrders = response.data;
      }

      return productOrders.map(po => ({
        id: po.id_product_order,
        orderId: po.id_order,
        productId: po.id_product,
        quantity: po.quantity,
        unitPrice: po.unit_price,
        subtotal: po.quantity * po.unit_price,
      }));
    } catch (error) {
      console.error(`❌ Error fetching product orders for product #${producto.id_product}:`, error.response?.data);
      return [];
    }
  }

  @ResolveField(() => [SubcategoryProduct], { nullable: true })
  async subcategoryProducts(@Parent() producto: Producto): Promise<SubcategoryProduct[]> {
    try {
      const response = await axios.get(`http://localhost:3006/api/v1/subcategory-products/product/${producto.id_product}`);
      let subcategoryProducts = [];
      
      if (response.data && Array.isArray(response.data.data)) {
        subcategoryProducts = response.data.data;
      } else if (Array.isArray(response.data)) {
        subcategoryProducts = response.data;
      }

      return subcategoryProducts.map(sp => ({
        id_subcategory_product: sp.id_subcategory_product,
        id_subcategory: sp.id_subcategory,
        id_product: sp.id_product,
        created_at: sp.created_at ? new Date(sp.created_at) : null,
      }));
    } catch (error) {
      console.error(`❌ Error fetching subcategory products for product #${producto.id_product}:`, error.response?.data);
      return [];
    }
  }
}
