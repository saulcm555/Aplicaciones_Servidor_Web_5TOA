# Queries GraphQL - Documentación y Ejemplos

Este documento contiene las 9 queries implementadas organizadas en 3 categorías, con ejemplos de uso para cada una.

---

## 📊 CATEGORÍA 1: Vistas Unificadas y Dashboards
**Enfoque:** Combinar datos de múltiples entidades para crear vistas consolidadas

### Query 1: `vendedoresConProductos`
**Descripción:** Obtiene información detallada de vendedores incluyendo estadísticas de sus productos, categorías y valor de inventario.

**Entidades combinadas:** Sellers + Products + Categories

**Ejemplo de uso:**
```graphql
query {
  vendedoresConProductos(limite: 5) {
    idVendedor
    nombreVendedor
    email
    totalProductos
    valorInventario
    precioPromedio
    categorias
  }
}
```

---

### Query 2: `productosInventarioBajo`
**Descripción:** Identifica productos con stock crítico incluyendo información del vendedor y nivel de urgencia para reabastecimiento.

**Entidades combinadas:** Products + Sellers + Inventory

**Ejemplo de uso:**
```graphql
query {
  productosInventarioBajo(umbral: 15) {
    productoId
    nombreProducto
    stockActual
    stockMinimo
    precio
    nombreVendedor
    nivelCriticidad
  }
}
```

**Niveles de criticidad:**
- `CRÍTICO`: Stock = 0
- `ALTO`: Stock <= umbral/2
- `MEDIO`: Stock <= umbral
- `BAJO`: Stock > umbral

---

### Query 3: `clientesConHistorialCompras`
**Descripción:** Obtiene perfil completo de clientes incluyendo estadísticas de compras, gasto total y comportamiento de compra.

**Entidades combinadas:** Clients + Orders + Products

**Ejemplo de uso:**
```graphql
query {
  clientesConHistorialCompras(comprasMinimas: 2) {
    idCliente
    nombre
    email
    totalOrdenes
    totalGastado
    gastoPorOrden
    ultimaCompra
    estado
  }
}
```

**Estados posibles:**
- `activo`: Compró en los últimos 90 días
- `inactivo`: Sin compras en los últimos 90 días

---

## 📈 CATEGORÍA 2: Cálculos y Estadísticas (KPIs)
**Enfoque:** Implementar lógica de agregación y métricas de negocio

### Query 4: `productosMasVendidos`
**Descripción:** Obtiene los productos más vendidos con métricas de rendimiento: unidades vendidas, ingresos totales, precio promedio y número de órdenes.

**Entidades combinadas:** Products + ProductOrders + Orders + Categories

**Ejemplo de uso:**
```graphql
query {
  productosMasVendidos(filtro: { limite: 10 }) {
    productoId
    nombre
    categoria
    unidadesVendidas
    ingresosTotales
    precioPromedio
    numeroOrdenes
  }
}
```

**Con filtro de período:**
```graphql
query {
  productosMasVendidos(filtro: { mes: 10, anio: 2025, limite: 5 }) {
    productoId
    nombre
    unidadesVendidas
    ingresosTotales
  }
}
```

---

### Query 5: `estadisticasVentas`
**Descripción:** Calcula KPIs de ventas: total de órdenes, ingresos, ticket promedio, productos vendidos y clientes únicos.

**Entidades combinadas:** Orders + ProductOrders + Clients

**Ejemplo de uso:**
```graphql
query {
  estadisticasVentas {
    totalOrdenes
    ingresosTotales
    ticketPromedio
    productosVendidos
    clientesUnicos
    tasaConversion
  }
}
```

**Con filtro de mes:**
```graphql
query {
  estadisticasVentas(filtro: { mes: 10, anio: 2025 }) {
    totalOrdenes
    ingresosTotales
    ticketPromedio
    productosVendidos
    clientesUnicos
  }
}
```

---

### Query 6: `rendimientoCategorias`
**Descripción:** Analiza el rendimiento de cada categoría: productos totales, ventas, ingresos y tasa de rotación de inventario.

**Entidades combinadas:** Categories + Products + ProductOrders

**Ejemplo de uso:**
```graphql
query {
  rendimientoCategorias {
    categoriaId
    nombreCategoria
    totalProductos
    productosVendidos
    ingresos
    tasaRotacion
  }
}
```

**Cálculos realizados:**
- Tasa de rotación = (Productos vendidos / Total productos) * 100

---

## 🔍 CATEGORÍA 3: Filtros Complejos
**Enfoque:** Búsquedas parametrizadas con múltiples criterios, ordenamiento y paginación

### Query 7: `buscarProductosAvanzado`
**Descripción:** Búsqueda avanzada de productos con múltiples criterios: texto, categoría, vendedor, rangos de precio y stock, con ordenamiento y paginación.

**Ejemplo de uso básico:**
```graphql
query {
  buscarProductosAvanzado(filtro: { 
    busqueda: "laptop"
    limite: 10
    pagina: 1
  }) {
    data {
      id_product
      product_name
      price
      stock
    }
    meta {
      total
      page
      totalPages
      hasNextPage
      hasPreviousPage
    }
  }
}
```

**Búsqueda con todos los filtros:**
```graphql
query {
  buscarProductosAvanzado(filtro: {
    busqueda: "laptop"
    categoriaId: 1
    vendedorId: 5
    precioMinimo: 500
    precioMaximo: 2000
    stockMinimo: 10
    ordenarPor: "price"
    direccion: "ASC"
    pagina: 1
    limite: 20
  }) {
    data {
      id_product
      product_name
      price
      stock
      description
    }
    meta {
      total
      page
      limit
      totalPages
    }
  }
}
```

**Campos de ordenamiento disponibles:**
- `product_name`, `price`, `stock`, `created_at`

---

### Query 8: `filtrarClientesPorComportamiento`
**Descripción:** Filtra clientes basándose en su comportamiento de compra: compras mínimas, gasto total, actividad reciente y estado.

**Ejemplo de uso:**
```graphql
query {
  filtrarClientesPorComportamiento(filtro: {
    comprasMinimas: 3
    gastoMinimo: 1000
    estado: "activo"
    limite: 15
  }) {
    idCliente
    nombre
    email
    totalOrdenes
    totalGastado
    gastoPorOrden
    ultimaCompra
    estado
  }
}
```

**Buscar clientes inactivos:**
```graphql
query {
  filtrarClientesPorComportamiento(filtro: {
    estado: "inactivo"
    diasUltimaCompra: 90
    limite: 10
  }) {
    idCliente
    nombre
    totalOrdenes
    totalGastado
    ultimaCompra
  }
}
```

---

### Query 9: `compararVentasPorPeriodos`
**Descripción:** Compara ventas mes a mes en un rango de fechas, calculando ingresos, órdenes y variación porcentual entre períodos.

**Ejemplo de uso:**
```graphql
query {
  compararVentasPorPeriodos(rango: {
    mesInicial: 1
    anioInicial: 2025
    mesFinal: 10
    anioFinal: 2025
  }) {
    mes
    anio
    ingresos
    ordenes
    variacionPorcentual
  }
}
```

**Comparación trimestral:**
```graphql
query {
  compararVentasPorPeriodos(rango: {
    mesInicial: 7
    anioInicial: 2025
    mesFinal: 9
    anioFinal: 2025
  }) {
    mes
    anio
    ingresos
    ordenes
    variacionPorcentual
  }
}
```

---

## 🎯 Queries Básicas (Bonus)

### Productos
```graphql
query {
  products {
    id_product
    product_name
    price
    stock
  }
}

query {
  product(id: 1) {
    id_product
    product_name
    description
    price
    stock
  }
}
```

### Categorías
```graphql
query {
  categories {
    id_category
    category_name
    description
  }
}

query {
  category(id: 1) {
    id_category
    category_name
    description
  }
}
```

### Vendedores
```graphql
query {
  sellers {
    id
    name
    email
    phone
    businessName
  }
}
```

### Clientes
```graphql
query {
  clients {
    id_client
    name
    email
    phone
    address
  }
}
```

---

## 📝 Notas Técnicas

### Optimizaciones Implementadas
- **DataLoaders**: Para evitar el problema N+1 en consultas relacionadas
- **Agregación en memoria**: Cálculos complejos sin múltiples llamadas al REST API
- **Paginación**: Implementada en búsquedas avanzadas
- **Caché de mapas**: Uso de `Map` para búsquedas O(1)

### Validaciones
- Todos los inputs tienen validaciones con class-validator
- Rangos de fechas validados (mes: 1-12, año: >= 2020)
- Límites de paginación (máximo 100 items por página)

### Variables de Entorno
```env
REST_API_URL=http://localhost:3000
PORT=3004
```

---

## 🚀 Ejemplos de Uso Combinado

### Dashboard de Ventas Completo
```graphql
query DashboardVentas {
  # KPIs Generales
  kpis: estadisticasVentas {
    totalOrdenes
    ingresosTotales
    ticketPromedio
    clientesUnicos
  }
  
  # Top Productos
  topProductos: productosMasVendidos(filtro: { limite: 5 }) {
    nombre
    unidadesVendidas
    ingresosTotales
  }
  
  # Rendimiento de Categorías
  categorias: rendimientoCategorias {
    nombreCategoria
    ingresos
    tasaRotacion
  }
}
```

### Reporte de Inventario
```graphql
query ReporteInventario {
  # Productos con stock bajo
  stockBajo: productosInventarioBajo(umbral: 10) {
    nombreProducto
    stockActual
    nivelCriticidad
    nombreVendedor
  }
  
  # Top Vendedores por Inventario
  vendedores: vendedoresConProductos(limite: 5) {
    nombreVendedor
    totalProductos
    valorInventario
  }
}
```

### Análisis de Clientes
```graphql
query AnalisisClientes {
  # Clientes VIP
  clientesVIP: filtrarClientesPorComportamiento(filtro: {
    gastoMinimo: 5000
    estado: "activo"
    limite: 10
  }) {
    nombre
    totalGastado
    totalOrdenes
  }
  
  # Clientes con historial completo
  historial: clientesConHistorialCompras(comprasMinimas: 5) {
    nombre
    totalOrdenes
    gastoPorOrden
    estado
  }
}
```
