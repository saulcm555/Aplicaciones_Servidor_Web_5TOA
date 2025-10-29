import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class ProductosMasVendidosType {
  @Field(() => Int, { description: 'ID del producto' })
  productoId: number;

  @Field({ description: 'Nombre del producto' })
  nombre: string;

  @Field({ description: 'Categoría del producto' })
  categoria: string;

  @Field(() => Int, { description: 'Total de unidades vendidas' })
  unidadesVendidas: number;

  @Field(() => Float, { description: 'Ingresos totales generados' })
  ingresosTotales: number;

  @Field(() => Float, { description: 'Precio promedio de venta' })
  precioPromedio: number;

  @Field(() => Int, { description: 'Número de órdenes que incluyen este producto' })
  numeroOrdenes: number;
}

@ObjectType()
export class VendedorConProductosType {
  @Field(() => Int, { description: 'ID del vendedor' })
  idVendedor: number;

  @Field({ description: 'Nombre del vendedor' })
  nombreVendedor: string;

  @Field({ description: 'Email del vendedor' })
  email: string;

  @Field(() => Int, { description: 'Total de productos activos' })
  totalProductos: number;

  @Field(() => Float, { description: 'Inventario total en valor' })
  valorInventario: number;

  @Field(() => Float, { description: 'Precio promedio de productos' })
  precioPromedio: number;

  @Field(() => [String], { description: 'Categorías en las que vende' })
  categorias: string[];
}

@ObjectType()
export class InventarioBajoType {
  @Field(() => Int, { description: 'ID del producto' })
  productoId: number;

  @Field({ description: 'Nombre del producto' })
  nombreProducto: string;

  @Field(() => Int, { description: 'Stock actual' })
  stockActual: number;

  @Field(() => Int, { description: 'Stock mínimo recomendado' })
  stockMinimo: number;

  @Field(() => Float, { description: 'Precio del producto' })
  precio: number;

  @Field({ description: 'Nombre del vendedor' })
  nombreVendedor: string;

  @Field({ description: 'Nivel de criticidad', nullable: true })
  nivelCriticidad?: string;
}

@ObjectType()
export class EstadisticasVentasType {
  @Field(() => Int, { description: 'Total de órdenes en el período' })
  totalOrdenes: number;

  @Field(() => Float, { description: 'Ingresos totales' })
  ingresosTotales: number;

  @Field(() => Float, { description: 'Ticket promedio' })
  ticketPromedio: number;

  @Field(() => Int, { description: 'Total de productos vendidos' })
  productosVendidos: number;

  @Field(() => Int, { description: 'Clientes únicos' })
  clientesUnicos: number;

  @Field(() => Float, { description: 'Tasa de conversión en porcentaje', nullable: true })
  tasaConversion?: number;
}

@ObjectType()
export class ComparacionMensualType {
  @Field(() => Int, { description: 'Mes' })
  mes: number;

  @Field(() => Int, { description: 'Año' })
  anio: number;

  @Field(() => Float, { description: 'Ingresos del mes' })
  ingresos: number;

  @Field(() => Int, { description: 'Órdenes del mes' })
  ordenes: number;

  @Field(() => Float, { description: 'Variación porcentual respecto al mes anterior', nullable: true })
  variacionPorcentual?: number;
}

@ObjectType()
export class ClienteConComprasType {
  @Field(() => Int, { description: 'ID del cliente' })
  idCliente: number;

  @Field({ description: 'Nombre del cliente' })
  nombre: string;

  @Field({ description: 'Email del cliente' })
  email: string;

  @Field(() => Int, { description: 'Total de órdenes realizadas' })
  totalOrdenes: number;

  @Field(() => Float, { description: 'Total gastado' })
  totalGastado: number;

  @Field(() => Float, { description: 'Promedio de gasto por orden' })
  gastoPorOrden: number;

  @Field({ description: 'Fecha de última compra' })
  ultimaCompra: string;

  @Field({ description: 'Estado del cliente (activo/inactivo)' })
  estado: string;
}

@ObjectType()
export class RendimientoCategoriasType {
  @Field(() => Int, { description: 'ID de la categoría' })
  categoriaId: number;

  @Field({ description: 'Nombre de la categoría' })
  nombreCategoria: string;

  @Field(() => Int, { description: 'Total de productos en la categoría' })
  totalProductos: number;

  @Field(() => Int, { description: 'Productos vendidos' })
  productosVendidos: number;

  @Field(() => Float, { description: 'Ingresos generados' })
  ingresos: number;

  @Field(() => Float, { description: 'Tasa de rotación de inventario', nullable: true })
  tasaRotacion?: number;
}
