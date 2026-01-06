import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ProductosMasVendidosType,
  EstadisticasVentasType,
  RendimientoCategoriasType,
} from '../types/analytics.types';
import { FiltroVentasInput } from '../inputs/analytics.inputs';
import { Producto } from '../productos/entities/producto.entity';
import { Order } from '../orders/entities/order.entity';
import { Category } from '../categories/entities/category.entity';
import { ProductOrder } from '../product-orders/entities/product-order.entity';

/**
 * Resolver para queries con cálculos y estadísticas
 * Enfoque: KPIs y métricas de negocio
 */
@Resolver()
export class AnalyticsStatsResolver {
  private readonly REST_API_URL = process.env.REST_API_URL || 'http://localhost:3006';

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  /**
   * QUERY 4: Productos más vendidos con métricas calculadas
   * Combina: Products + ProductOrders + Orders
   * Calcula: Unidades vendidas, ingresos, promedio
   */
  @Query(() => [ProductosMasVendidosType], {
    name: 'productosMasVendidos',
    description: 'Obtiene los productos más vendidos con métricas de rendimiento: unidades vendidas, ingresos totales, precio promedio y número de órdenes',
  })
  async productosMasVendidos(
    @Args('filtro', { nullable: true }) filtro?: FiltroVentasInput,
  ): Promise<ProductosMasVendidosType[]> {
    const limite = filtro?.limite || 10;

    // 1. Obtener productos
    const productsResponse = await firstValueFrom(
      this.httpService.get<{ data: Producto[] }>(`${this.REST_API_URL}/api/v1/products`),
    );
    const products = productsResponse.data.data || [];

    // 2. Obtener product-orders
    const productOrdersResponse = await firstValueFrom(
      this.httpService.get<ProductOrder[]>(`${this.REST_API_URL}/api/v1/product-orders`),
    );
    const productOrders = productOrdersResponse.data;

    // 3. Obtener categorías
    const categoriesResponse = await firstValueFrom(
      this.httpService.get<Category[]>(`${this.REST_API_URL}/api/v1/categories`),
    );
    const categories = categoriesResponse.data;

    const categoryMap = new Map(
      categories.map((cat) => [cat.id_category, cat.category_name]),
    );

    // 4. Agrupar por producto y calcular estadísticas
    const ventasPorProducto = new Map<number, {
      unidades: number;
      ingresos: number;
      ordenes: Set<number>;
    }>();

    productOrders.forEach((po) => {
      if (!ventasPorProducto.has(po.productId)) {
        ventasPorProducto.set(po.productId, {
          unidades: 0,
          ingresos: 0,
          ordenes: new Set(),
        });
      }

      const stats = ventasPorProducto.get(po.productId);
      stats.unidades += po.quantity;
      stats.ingresos += po.unitPrice * po.quantity;
      stats.ordenes.add(po.orderId);
    });

    // 5. Construir resultado con información del producto
    const resultado = Array.from(ventasPorProducto.entries())
      .map(([productId, stats]) => {
        const producto = products.find((p) => p.id_product === productId);
        if (!producto) return null;

        const precioPromedio = stats.unidades > 0
          ? stats.ingresos / stats.unidades
          : producto.price;

        return {
          productoId: productId,
          nombre: producto.product_name,
          categoria: categoryMap.get(producto.id_category) || 'Sin categoría',
          unidadesVendidas: stats.unidades,
          ingresosTotales: parseFloat(stats.ingresos.toFixed(2)),
          precioPromedio: parseFloat(precioPromedio.toFixed(2)),
          numeroOrdenes: stats.ordenes.size,
        };
      })
      .filter(Boolean);

    // Ordenar por unidades vendidas descendente
    return resultado
      .sort((a, b) => b.unidadesVendidas - a.unidadesVendidas)
      .slice(0, limite);
  }

  /**
   * QUERY 5: Estadísticas generales de ventas
   * Combina: Orders + ProductOrders + Clients
   * Calcula: KPIs de negocio
   */
  @Query(() => EstadisticasVentasType, {
    name: 'estadisticasVentas',
    description: 'Calcula KPIs de ventas: total de órdenes, ingresos, ticket promedio, productos vendidos y clientes únicos',
  })
  async estadisticasVentas(
    @Args('filtro', { nullable: true }) filtro?: FiltroVentasInput,
  ): Promise<EstadisticasVentasType> {
    // 1. Obtener órdenes
    const ordersResponse = await firstValueFrom(
      this.httpService.get<Order[]>(`${this.REST_API_URL}/api/v1/orders`),
    );
    const orders = ordersResponse.data;

    // 2. Obtener product-orders
    const productOrdersResponse = await firstValueFrom(
      this.httpService.get<ProductOrder[]>(`${this.REST_API_URL}/api/v1/product-orders`),
    );
    const productOrders = productOrdersResponse.data;

    // Filtrar por fecha si se proporciona
    let ordenesFiltradas = orders;
    if (filtro?.mes && filtro?.anio) {
      ordenesFiltradas = orders.filter((order) => {
        const fecha = new Date(order.order_date);
        return (
          fecha.getMonth() + 1 === filtro.mes &&
          fecha.getFullYear() === filtro.anio
        );
      });
    }

    // 3. Calcular estadísticas
    const totalOrdenes = ordenesFiltradas.length;
    const ingresosTotales = ordenesFiltradas.reduce(
      (sum, o) => sum + o.total_amount,
      0,
    );
    const ticketPromedio = totalOrdenes > 0 ? ingresosTotales / totalOrdenes : 0;

    // Clientes únicos
    const clientesUnicos = new Set(ordenesFiltradas.map((o) => o.id_client)).size;

    // Total de productos vendidos
    const idsOrdenesActuales = new Set(ordenesFiltradas.map((o) => o.id_order));
    const productOrdersFiltrados = productOrders.filter((po) =>
      idsOrdenesActuales.has(po.orderId),
    );
    const productosVendidos = productOrdersFiltrados.reduce(
      (sum, po) => sum + po.quantity,
      0,
    );

    return {
      totalOrdenes,
      ingresosTotales: parseFloat(ingresosTotales.toFixed(2)),
      ticketPromedio: parseFloat(ticketPromedio.toFixed(2)),
      productosVendidos,
      clientesUnicos,
      tasaConversion: null, // Requeriría datos de visitas/sesiones
    };
  }

  /**
   * QUERY 6: Rendimiento por categorías
   * Combina: Categories + Products + ProductOrders
   * Calcula: Métricas de rotación y rendimiento por categoría
   */
  @Query(() => [RendimientoCategoriasType], {
    name: 'rendimientoCategorias',
    description: 'Analiza el rendimiento de cada categoría: productos totales, ventas, ingresos y tasa de rotación de inventario',
  })
  async rendimientoCategorias(): Promise<RendimientoCategoriasType[]> {
    // 1. Obtener categorías
    const categoriesResponse = await firstValueFrom(
      this.httpService.get<Category[]>(`${this.REST_API_URL}/api/v1/categories`),
    );
    const categories = categoriesResponse.data;

    // 2. Obtener productos
    const productsResponse = await firstValueFrom(
      this.httpService.get<{ data: Producto[] }>(`${this.REST_API_URL}/api/v1/products`),
    );
    const products = productsResponse.data.data || [];

    // 3. Obtener product-orders
    const productOrdersResponse = await firstValueFrom(
      this.httpService.get<ProductOrder[]>(`${this.REST_API_URL}/api/v1/product-orders`),
    );
    const productOrders = productOrdersResponse.data;

    // 4. Crear mapa de ventas por producto
    const ventasPorProducto = new Map<number, { unidades: number; ingresos: number }>();
    productOrders.forEach((po) => {
      if (!ventasPorProducto.has(po.productId)) {
        ventasPorProducto.set(po.productId, { unidades: 0, ingresos: 0 });
      }
      const stats = ventasPorProducto.get(po.productId);
      stats.unidades += po.quantity;
      stats.ingresos += po.unitPrice * po.quantity;
    });

    // 5. Calcular estadísticas por categoría
    const resultado = categories.map((categoria) => {
      const productosCategoria = products.filter(
        (p) => p.id_category === categoria.id_category,
      );

      const totalProductos = productosCategoria.length;
      const productosVendidos = productosCategoria.filter((p) =>
        ventasPorProducto.has(p.id_product),
      ).length;

      const ingresos = productosCategoria.reduce((sum, p) => {
        const ventas = ventasPorProducto.get(p.id_product);
        return sum + (ventas?.ingresos || 0);
      }, 0);

      // Calcular tasa de rotación (productos vendidos / total productos * 100)
      const tasaRotacion = totalProductos > 0
        ? (productosVendidos / totalProductos) * 100
        : 0;

      return {
        categoriaId: categoria.id_category,
        nombreCategoria: categoria.category_name,
        totalProductos,
        productosVendidos,
        ingresos: parseFloat(ingresos.toFixed(2)),
        tasaRotacion: parseFloat(tasaRotacion.toFixed(2)),
      };
    });

    // Ordenar por ingresos descendente
    return resultado.sort((a, b) => b.ingresos - a.ingresos);
  }
}
