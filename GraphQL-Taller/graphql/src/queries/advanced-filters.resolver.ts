import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  FiltroBusquedaProductosInput,
  FiltroClientesInput,
  RangoPeriodoInput,
} from '../inputs/analytics.inputs';
import { Producto } from '../productos/entities/producto.entity';
import { PaginatedProducts } from '../types/paginated-products.type';
import { ClienteConComprasType } from '../types/analytics.types';
import { ComparacionMensualType } from '../types/analytics.types';
import { Client } from '../clients/entities/client.entity';
import { Order } from '../orders/entities/order.entity';

/**
 * Resolver para queries con filtros complejos
 * Enfoque: Búsquedas parametrizadas avanzadas
 */
@Resolver()
export class AdvancedFiltersResolver {
  private readonly REST_API_URL = process.env.REST_API_URL || 'http://localhost:3006';

  constructor(
    @Inject(HttpService)
    private readonly httpService: HttpService,
  ) {}

  /**
   * QUERY 7: Búsqueda avanzada de productos con múltiples filtros
   * Filtros: Búsqueda, categoría, vendedor, rango de precio, rango de stock, ordenamiento, paginación
   */
  @Query(() => PaginatedProducts, {
    name: 'buscarProductosAvanzado',
    description: 'Búsqueda avanzada de productos con múltiples criterios: texto, categoría, vendedor, rangos de precio y stock, con ordenamiento y paginación',
  })
  async buscarProductosAvanzado(
    @Args('filtro') filtro: FiltroBusquedaProductosInput,
  ): Promise<PaginatedProducts> {
    // 1. Obtener todos los productos
    const response = await firstValueFrom(
      this.httpService.get<{ data: Producto[] }>(`${this.REST_API_URL}/api/v1/products`),
    );

    // La API REST devuelve { data: [], total, limit, offset }
    const apiResponse = response.data;
    const allProducts = apiResponse.data || [];

    // Validar que sea un array
    if (!Array.isArray(allProducts)) {
      throw new Error('La respuesta del API no es un array de productos');
    }

    // 2. Aplicar filtros
    let productosFiltrados = [...allProducts];

    // Filtro de búsqueda por nombre o descripción
    if (filtro.busqueda) {
      const termino = filtro.busqueda.toLowerCase();
      productosFiltrados = productosFiltrados.filter(
        (p) =>
          p.product_name.toLowerCase().includes(termino) ||
          (p.description && p.description.toLowerCase().includes(termino)),
      );
    }

    // Filtro por categoría
    if (filtro.categoriaId) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.id_category === filtro.categoriaId,
      );
    }

    // Filtro por vendedor
    if (filtro.vendedorId) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.id_seller === filtro.vendedorId,
      );
    }

    // Filtro por rango de stock
    if (filtro.stockMinimo !== undefined) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.stock >= filtro.stockMinimo,
      );
    }
    if (filtro.stockMaximo !== undefined) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.stock <= filtro.stockMaximo,
      );
    }

    // Filtro por rango de precio
    if (filtro.precioMinimo !== undefined) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.price >= filtro.precioMinimo,
      );
    }
    if (filtro.precioMaximo !== undefined) {
      productosFiltrados = productosFiltrados.filter(
        (p) => p.price <= filtro.precioMaximo,
      );
    }

    // 3. Aplicar ordenamiento
    const ordenarPor = filtro.ordenarPor || 'created_at';
    const direccion = (filtro.direccion || 'DESC').toUpperCase();

    productosFiltrados.sort((a, b) => {
      let valorA = a[ordenarPor];
      let valorB = b[ordenarPor];

      if (typeof valorA === 'string') {
        valorA = valorA.toLowerCase();
        valorB = valorB.toLowerCase();
      }

      if (direccion === 'ASC') {
        return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
      } else {
        return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
      }
    });

    // 4. Aplicar paginación
    const pagina = filtro.pagina || 1;
    const limite = filtro.limite || 20;
    const total = productosFiltrados.length;
    const totalPages = Math.ceil(total / limite);
    const inicio = (pagina - 1) * limite;
    const fin = inicio + limite;

    const data = productosFiltrados.slice(inicio, fin);

    return {
      data,
      meta: {
        total,
        page: pagina,
        limit: limite,
        totalPages,
        hasNextPage: pagina < totalPages,
        hasPreviousPage: pagina > 1,
      },
    };
  }

  /**
   * QUERY 8: Filtrado avanzado de clientes por comportamiento
   * Filtros: Compras mínimas, gasto mínimo, estado, días desde última compra
   */
  @Query(() => [ClienteConComprasType], {
    name: 'filtrarClientesPorComportamiento',
    description: 'Filtra clientes basándose en su comportamiento de compra: compras mínimas, gasto total, actividad reciente y estado',
  })
  async filtrarClientesPorComportamiento(
    @Args('filtro') filtro: FiltroClientesInput,
  ): Promise<ClienteConComprasType[]> {
    // 1. Obtener clientes
    const clientsResponse = await firstValueFrom(
      this.httpService.get<Client[]>(`${this.REST_API_URL}/api/v1/clients`),
    );
    const clients = clientsResponse.data;

    // 2. Obtener órdenes
    const ordersResponse = await firstValueFrom(
      this.httpService.get<Order[]>(`${this.REST_API_URL}/api/v1/orders`),
    );
    const orders = ordersResponse.data;

    // 3. Calcular estadísticas por cliente
    const clientesData = clients.map((client) => {
      const ordenesCliente = orders.filter((o) => o.id_client === client.id_client);

      const totalGastado = ordenesCliente.reduce((sum, o) => sum + Number(o.total_amount), 0);
      const gastoPorOrden =
        ordenesCliente.length > 0 ? totalGastado / ordenesCliente.length : 0;

      const fechasOrdenes = ordenesCliente
        .map((o) => new Date(o.order_date))
        .sort((a, b) => b.getTime() - a.getTime());

      const ultimaCompra =
        fechasOrdenes.length > 0
          ? fechasOrdenes[0].toISOString()
          : client.created_at;

      const diasDesdeUltimaCompra =
        fechasOrdenes.length > 0
          ? Math.floor(
              (Date.now() - fechasOrdenes[0].getTime()) / (1000 * 60 * 60 * 24),
            )
          : 999;

      const estado = diasDesdeUltimaCompra <= 90 ? 'activo' : 'inactivo';

      return {
        idCliente: client.id_client,
        nombre: client.client_name,
        email: client.client_email,
        totalOrdenes: ordenesCliente.length,
        totalGastado: parseFloat(totalGastado.toFixed(2)),
        gastoPorOrden: parseFloat(gastoPorOrden.toFixed(2)),
        ultimaCompra,
        estado,
        diasDesdeUltimaCompra,
      };
    });

    // 4. Aplicar filtros
    let clientesFiltrados = clientesData;

    if (filtro.comprasMinimas !== undefined) {
      clientesFiltrados = clientesFiltrados.filter(
        (c) => c.totalOrdenes >= filtro.comprasMinimas,
      );
    }

    if (filtro.gastoMinimo !== undefined) {
      clientesFiltrados = clientesFiltrados.filter(
        (c) => c.totalGastado >= filtro.gastoMinimo,
      );
    }

    if (filtro.estado) {
      clientesFiltrados = clientesFiltrados.filter(
        (c) => c.estado === filtro.estado,
      );
    }

    if (filtro.diasUltimaCompra !== undefined) {
      clientesFiltrados = clientesFiltrados.filter(
        (c) => c.diasDesdeUltimaCompra >= filtro.diasUltimaCompra,
      );
    }

    // 5. Ordenar por total gastado y limitar
    const limite = filtro.limite || 20;
    return clientesFiltrados
      .sort((a, b) => b.totalGastado - a.totalGastado)
      .slice(0, limite)
      .map(({ diasDesdeUltimaCompra, ...rest }) => rest); // Remover campo auxiliar
  }

  /**
   * QUERY 9: Comparación de ventas por períodos con filtros de rango
   * Filtros: Rango de fechas (mes/año inicial y final)
   */
  @Query(() => [ComparacionMensualType], {
    name: 'compararVentasPorPeriodos',
    description: 'Compara ventas mes a mes en un rango de fechas, calculando ingresos, órdenes y variación porcentual entre períodos',
  })
  async compararVentasPorPeriodos(
    @Args('rango') rango: RangoPeriodoInput,
  ): Promise<ComparacionMensualType[]> {
    // 1. Obtener todas las órdenes
    const ordersResponse = await firstValueFrom(
      this.httpService.get<Order[]>(`${this.REST_API_URL}/api/v1/orders`),
    );
    const orders = ordersResponse.data;

    // 2. Generar lista de meses en el rango
    const meses: { mes: number; anio: number }[] = [];
    let currentDate = new Date(rango.anioInicial, rango.mesInicial - 1, 1);
    const endDate = new Date(rango.anioFinal, rango.mesFinal - 1, 1);

    while (currentDate <= endDate) {
      meses.push({
        mes: currentDate.getMonth() + 1,
        anio: currentDate.getFullYear(),
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // 3. Calcular estadísticas por mes
    const resultado: ComparacionMensualType[] = meses.map((periodo) => {
      const ordenesMes = orders.filter((order) => {
        const fecha = new Date(order.order_date);
        return (
          fecha.getMonth() + 1 === periodo.mes &&
          fecha.getFullYear() === periodo.anio
        );
      });

      const ingresos = ordenesMes.reduce((sum, o) => sum + Number(o.total_amount), 0);
      const ordenes = ordenesMes.length;

      return {
        mes: periodo.mes,
        anio: periodo.anio,
        ingresos: parseFloat(ingresos.toFixed(2)),
        ordenes,
        variacionPorcentual: null, // Se calculará después
      };
    });

    // 4. Calcular variación porcentual entre meses
    for (let i = 1; i < resultado.length; i++) {
      const mesActual = resultado[i];
      const mesAnterior = resultado[i - 1];
      
      if (mesAnterior.ingresos > 0) {
        const variacion = ((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos) * 100;
        mesActual.variacionPorcentual = parseFloat(variacion.toFixed(2));
      }
    }

    return resultado;
  }
}
