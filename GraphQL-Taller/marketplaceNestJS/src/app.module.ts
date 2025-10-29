import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { AdminsModule } from './admins/admins.module';
import { SellersModule } from './sellers/sellers.module';
import { CartsModule } from './carts/carts.module';
import { ProductCartsModule } from './product-carts/product-carts.module';
import { OrdersModule } from './orders/orders.module';
import { ProductOrdersModule } from './product-orders/product-orders.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { ClientsModule } from './clients/clients.module';
import { InventoriesModule } from './inventories/inventories.module';
import { SubcategoryProductsModule } from './subcategory-products/subcategory-products.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'marketplace.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Sincroniza automáticamente el esquema (solo para desarrollo)
      logging: true, // Muestra las consultas SQL en la consola
    }),
    ProductsModule,
    CategoriesModule,
    PaymentMethodsModule,
    AdminsModule,
    SellersModule,
    CartsModule,
    ProductCartsModule,
    OrdersModule,
    ProductOrdersModule,
    DeliveriesModule,
    ClientsModule,
    InventoriesModule,
    SubcategoryProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
