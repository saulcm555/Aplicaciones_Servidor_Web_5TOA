import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min, Max, IsEnum } from 'class-validator';

@InputType()
export class FiltroVentasInput {
  @Field(() => Int, { description: 'Mes (1-12)', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  mes?: number;

  @Field(() => Int, { description: 'Año', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(2020)
  anio?: number;

  @Field(() => Int, { description: 'Límite de resultados', nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limite?: number;
}

@InputType()
export class FiltroBusquedaProductosInput {
  @Field({ description: 'Término de búsqueda en nombre o descripción', nullable: true })
  @IsOptional()
  busqueda?: string;

  @Field(() => Int, { description: 'ID de categoría', nullable: true })
  @IsOptional()
  @IsInt()
  categoriaId?: number;

  @Field(() => Int, { description: 'ID de vendedor', nullable: true })
  @IsOptional()
  @IsInt()
  vendedorId?: number;

  @Field(() => Int, { description: 'Stock mínimo', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  stockMinimo?: number;

  @Field(() => Int, { description: 'Stock máximo', nullable: true })
  @IsOptional()
  @IsInt()
  stockMaximo?: number;

  @Field(() => Int, { description: 'Precio mínimo', nullable: true })
  @IsOptional()
  precioMinimo?: number;

  @Field(() => Int, { description: 'Precio máximo', nullable: true })
  @IsOptional()
  precioMaximo?: number;

  @Field({ description: 'Ordenar por campo', nullable: true, defaultValue: 'created_at' })
  @IsOptional()
  ordenarPor?: string;

  @Field({ description: 'Dirección de orden (ASC/DESC)', nullable: true, defaultValue: 'DESC' })
  @IsOptional()
  direccion?: string;

  @Field(() => Int, { description: 'Página', nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  pagina?: number;

  @Field(() => Int, { description: 'Límite por página', nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limite?: number;
}

@InputType()
export class FiltroClientesInput {
  @Field(() => Int, { description: 'Compras mínimas realizadas', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  comprasMinimas?: number;

  @Field(() => Int, { description: 'Gasto mínimo total', nullable: true })
  @IsOptional()
  gastoMinimo?: number;

  @Field({ description: 'Estado del cliente (activo/inactivo)', nullable: true })
  @IsOptional()
  estado?: string;

  @Field(() => Int, { description: 'Días desde última compra', nullable: true })
  @IsOptional()
  @IsInt()
  diasUltimaCompra?: number;

  @Field(() => Int, { description: 'Límite de resultados', nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limite?: number;
}

@InputType()
export class RangoPeriodoInput {
  @Field(() => Int, { description: 'Mes inicial (1-12)' })
  @IsInt()
  @Min(1)
  @Max(12)
  mesInicial: number;

  @Field(() => Int, { description: 'Año inicial' })
  @IsInt()
  @Min(2020)
  anioInicial: number;

  @Field(() => Int, { description: 'Mes final (1-12)' })
  @IsInt()
  @Min(1)
  @Max(12)
  mesFinal: number;

  @Field(() => Int, { description: 'Año final' })
  @IsInt()
  @Min(2020)
  anioFinal: number;
}
