import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  VendedorConProductosType,
  InventarioBajoType,
  ClienteConComprasType,
} from '../types/analytics.types';
import { Producto } from '../productos/entities/producto.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { Category } from '../categories/entities/category.entity';
import { Client } from '../clients/entities/client.entity';
import { Order } from '../orders/entities/order.entity';

/**
 * Resolver para queries que combinan datos de múltiples entidades
 * Enfoque: Vistas unificadas y dashboards
 */
@Resolver()
export class UnifiedViewsResolver {
  private readonly REST_API_URL = process.env.REST_API_URL || 'http://localhost:3006';

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  /**
   * QUERY 1: Vendedores con información completa de sus productos
   * Combina: Sellers + Products + Categories
   */
  @Query(() => [VendedorConProductosType], {
    name: 'vendedoresConProductos',
    description: 'Obtiene información detallada de vendedores incluyendo estadísticas de sus productos, categorías y valor de inventario',
  })
  async vendedoresConProductos(
    @Args('limite', { type: () => Number, nullable: true, defaultValue: 10 }) limite: number,
  ): Promise<VendedorConProductosType[]> {
    // 1. Obtener todos los vendedores
    const response_sellers = await firstValueFrom(
      this.httpService.get<Seller[]>(`${this.REST_API_URL}/api/v1/sellers`),
    );
    const sellers = response_sellers.data;

    // 2. Obtener todos los productos
    const response_products = await firstValueFrom(
      this.httpService.get<{ data: Producto[] }>(`${this.REST_API_URL}/api/v1/products`),
    );
    const products = response_products.data.data || [];

    // 3. Obtener todas las categorías
    const response_categories = await firstValueFrom(
      this.httpService.get<Category[]>(`${this.REST_API_URL}/api/v1/categories`),
    );
    const categories = response_categories.data;

    // Crear mapa de categorías para búsqueda rápida
    const categoryMap = new Map(
      categories.map((cat) => [cat.id_category, cat.category_name]),
    );

    // 4. Agrupar productos por vendedor y calcular estadísticas
    const vendedoresData = sellers.map((seller: any) => {
      const productosVendedor = products.filter(
        (p) => p.id_seller === seller.id_seller,
      );

      const categoriaSet = new Set(
        productosVendedor
          .map((p) => categoryMap.get(p.id_category))
          .filter(Boolean),
      );

      const valorInventario = productosVendedor.reduce(
        (sum, p) => sum + p.price * p.stock,
        0,
      );

      const precioPromedio =
        productosVendedor.length > 0
          ? productosVendedor.reduce((sum, p) => sum + p.price, 0) /
            productosVendedor.length
          : 0;

      return {
        idVendedor: seller.id_seller,
        nombreVendedor: seller.seller_name,
        email: seller.email,
        totalProductos: productosVendedor.length,
        valorInventario: parseFloat(valorInventario.toFixed(2)),
        precioPromedio: parseFloat(precioPromedio.toFixed(2)),
        categorias: Array.from(categoriaSet),
      };
    });

    // Ordenar por valor de inventario descendente y limitar
    return vendedoresData
      .sort((a, b) => b.valorInventario - a.valorInventario)
      .slice(0, limite);
  }

  /**
   * QUERY 2: Productos con stock bajo y información del vendedor
   * Combina: Products + Sellers + Inventory
   */
  @Query(() => [InventarioBajoType], {
    name: 'productosInventarioBajo',
    description: 'Identifica productos con stock crítico incluyendo información del vendedor y nivel de urgencia para reabastecimiento',
  })
  async productosInventarioBajo(
    @Args('umbral', { type: () => Number, nullable: true, defaultValue: 10 })
    umbral: number,
  ): Promise<InventarioBajoType[]> {
    // 1. Obtener productos
    const response_products = await firstValueFrom(
      this.httpService.get<{ data: Producto[] }>(`${this.REST_API_URL}/api/v1/products`),
    );
    const products = response_products.data.data || [];

    // 2. Obtener vendedores
    const response_sellers = await firstValueFrom(
      this.httpService.get<any[]>(`${this.REST_API_URL}/api/v1/sellers`),
    );
    const sellers = response_sellers.data;

    // Crear mapa de vendedores
    const sellerMap = new Map(sellers.map((s: any) => [s.id_seller, s.seller_name]));

    // 3. Filtrar productos con stock bajo
    const productosBajos = products
      .filter((p) => p.stock <= umbral)
      .map((producto) => {
        const stockMinimo = Math.max(20, producto.stock * 2);
        let nivelCriticidad = 'BAJO';

        if (producto.stock === 0) {
          nivelCriticidad = 'CRÍTICO';
        } else if (producto.stock <= umbral / 2) {
          nivelCriticidad = 'ALTO';
        } else if (producto.stock <= umbral) {
          nivelCriticidad = 'MEDIO';
        }

        return {
          productoId: producto.id_product,
          nombreProducto: producto.product_name,
          stockActual: producto.stock,
          stockMinimo: stockMinimo,
          precio: producto.price,
          nombreVendedor: sellerMap.get(producto.id_seller) || 'Desconocido',
          nivelCriticidad,
        };
      });

    // Ordenar por nivel de criticidad (CRÍTICO > ALTO > MEDIO > BAJO)
    const ordenCriticidad = { CRÍTICO: 0, ALTO: 1, MEDIO: 2, BAJO: 3 };
    return productosBajos.sort(
      (a, b) => ordenCriticidad[a.nivelCriticidad] - ordenCriticidad[b.nivelCriticidad],
    );
  }

  /**
   * QUERY 3: Clientes con historial completo de compras
   * Combina: Clients + Orders + Products
   */
  @Query(() => [ClienteConComprasType], {
    name: 'clientesConHistorialCompras',
    description: 'Obtiene perfil completo de clientes incluyendo estadísticas de compras, gasto total y comportamiento de compra',
  })
  async clientesConHistorialCompras(
    @Args('comprasMinimas', { type: () => Number, nullable: true, defaultValue: 1 })
    comprasMinimas: number,
  ): Promise<ClienteConComprasType[]> {
    try {
      // 1. Obtener clientes
      const response_clients = await firstValueFrom(
        this.httpService.get<any[]>(`${this.REST_API_URL}/api/v1/clients`),
      );
      const clients = response_clients.data;

      // 2. Obtener órdenes
      const response_orders = await firstValueFrom(
        this.httpService.get<any[]>(`${this.REST_API_URL}/api/v1/orders`),
      );
      const orders = response_orders.data;

      // 3. Agrupar órdenes por cliente y calcular estadísticas
      const clientesData = clients.map((client: any) => {
        const ordenesCliente = orders.filter((o: any) => o.id_client === client.id_client);

      const totalGastado = ordenesCliente.reduce(
        (sum, o) => sum + (o.total_amount || 0),
        0,
      );

      const gastoPorOrden =
        ordenesCliente.length > 0 ? totalGastado / ordenesCliente.length : 0;

      // Obtener fecha de última compra
      const fechasOrdenes = ordenesCliente
        .map((o) => new Date(o.date))
        .sort((a, b) => b.getTime() - a.getTime());

      const ultimaCompra =
        fechasOrdenes.length > 0
          ? fechasOrdenes[0].toISOString()
          : client.created_at;

      // Determinar estado (activo si compró en los últimos 90 días)
      const diasDesdeUltimaCompra = fechasOrdenes.length > 0
        ? Math.floor(
            (Date.now() - fechasOrdenes[0].getTime()) / (1000 * 60 * 60 * 24),
          )
        : 999;

      const estado = diasDesdeUltimaCompra <= 90 ? 'activo' : 'inactivo';

      return {
        idCliente: client.id_client,
        nombre: client.client_name || client.name,
        email: client.client_email || client.email,
        totalOrdenes: ordenesCliente.length,
        totalGastado: parseFloat(totalGastado.toFixed(2)),
        gastoPorOrden: parseFloat(gastoPorOrden.toFixed(2)),
        ultimaCompra,
        estado,
      };
    });

      // Filtrar por compras mínimas y ordenar por total gastado
      return clientesData
        .filter((c) => c.totalOrdenes >= comprasMinimas)
        .sort((a, b) => b.totalGastado - a.totalGastado);
    } catch (error) {
      console.error('Error en clientesConHistorialCompras:', error);
      throw new Error('No se pudo obtener el historial de compras de clientes. Verifica que el endpoint /api/v1/clients esté funcionando correctamente.');
    }
  }
}
