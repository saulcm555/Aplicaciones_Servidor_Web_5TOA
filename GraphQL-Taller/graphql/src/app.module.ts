import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { ProductosModule } from './productos/productos.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { SellersModule } from './sellers/sellers.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { InventoriesModule } from './inventories/inventories.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { ProductOrdersModule } from './product-orders/product-orders.module';
import { ProductCartsModule } from './product-carts/product-carts.module';
import { SubcategoryProductsModule } from './subcategory-products/subcategory-products.module';
import { AdminsModule } from './admins/admins.module';
import { SubCategoriesModule } from './subcategories/subcategories.module';
import { 
  ProductQueriesResolver, 
  CategoryQueriesResolver, 
  SellerQueriesResolver, 
  ClientQueriesResolver,
  UnifiedViewsResolver,
  AnalyticsStatsResolver,
  AdvancedFiltersResolver,
} from './queries';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
    ProductosModule,
    CategoriesModule,
    ClientsModule,
    SellersModule,
    OrdersModule,
    CartsModule,
    InventoriesModule,
    PaymentMethodsModule,
    DeliveriesModule,
    ProductOrdersModule,
    ProductCartsModule,
    SubcategoryProductsModule,
    AdminsModule,
    SubCategoriesModule,
  ],
  providers: [
    ProductQueriesResolver,
    CategoryQueriesResolver,
    SellerQueriesResolver,
    ClientQueriesResolver,
    UnifiedViewsResolver,
    AnalyticsStatsResolver,
    AdvancedFiltersResolver,
  ],
})
export class AppModule {}
