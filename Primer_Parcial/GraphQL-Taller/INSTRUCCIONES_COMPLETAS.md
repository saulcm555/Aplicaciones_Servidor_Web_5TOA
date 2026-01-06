# 🚀 INSTRUCCIONES DE CONFIGURACIÓN COMPLETA

## ✅ RESUMEN DE LO QUE SE IMPLEMENTÓ

### 📦 Proyecto REST API (marketplaceNestJS)
- ✅ Módulo SubcategoryProducts agregado y registrado en app.module.ts
- ✅ Entidad Product actualizada con relación subcategoryProducts
- ✅ Todas las entidades configuradas con TypeORM

### 🌐 Proyecto GraphQL Gateway (graphql)
- ✅ Configuración completa de NestJS + GraphQL + Apollo Server
- ✅ 12 módulos implementados:
  - productos, categories, clients, sellers
  - orders, carts, inventories, payment-methods
  - deliveries, product-orders, product-carts, subcategory-products
- ✅ Todos los servicios consumen la REST API
- ✅ app.module.ts con GraphQLModule configurado
- ✅ main.ts con puerto 3001 y CORS habilitado

## 📋 PASOS PARA EJECUTAR

### 1️⃣ Instalar Dependencias del Proyecto GraphQL

```powershell
cd "C:\Users\saulc\OneDrive\Documentos\Universidad\QuintoSemestre\Aplicaciones_Servidores_Trabajos_INDIVIDUALES-GRUPALES\GraphQL-Taller\graphql"
npm install
```

**Esto instalará:**
- @nestjs/common, @nestjs/core, @nestjs/platform-express
- @nestjs/graphql, @nestjs/apollo
- @apollo/server
- graphql
- axios (para consumir REST API)
- dataloader (optimización)
- class-transformer, class-validator
- TypeScript y herramientas de desarrollo

### 2️⃣ Verificar Dependencias del Proyecto REST (opcional)

```powershell
cd "C:\Users\saulc\OneDrive\Documentos\Universidad\QuintoSemestre\Aplicaciones_Servidores_Trabajos_INDIVIDUALES-GRUPALES\GraphQL-Taller\marketplaceNestJS"
npm install
```

### 3️⃣ Iniciar el Servidor REST (puerto 3000)

```powershell
cd "C:\Users\saulc\OneDrive\Documentos\Universidad\QuintoSemestre\Aplicaciones_Servidores_Trabajos_INDIVIDUALES-GRUPALES\GraphQL-Taller\marketplaceNestJS"
npm run start:dev
```

**Deberías ver:**
```
Application is running on: http://localhost:3000
```

### 4️⃣ Iniciar el Servidor GraphQL (puerto 3001)

**En una NUEVA terminal:**

```powershell
cd "C:\Users\saulc\OneDrive\Documentos\Universidad\QuintoSemestre\Aplicaciones_Servidores_Trabajos_INDIVIDUALES-GRUPALES\GraphQL-Taller\graphql"
npm run start:dev
```

**Deberías ver:**
```
🚀 GraphQL Gateway running on: http://localhost:3001/graphql
📊 GraphQL Playground: http://localhost:3001/graphql
```

### 5️⃣ Probar GraphQL Playground

Abre tu navegador en: **http://localhost:3001/graphql**

Prueba este query:

```graphql
query {
  productos {
    id_product
    product_name
    price
    stock
  }
}
```

O este mutation:

```graphql
mutation {
  createProducto(createProductoInput: {
    product_name: "Test Product"
    description: "GraphQL Test"
    price: 99.99
    stock: 10
  }) {
    id_product
    product_name
  }
}
```

## 🔍 VERIFICACIÓN

### ✅ REST API funcionando
- Abre: http://localhost:3000/api/v1/products
- Deberías ver JSON con productos (o array vacío)

### ✅ GraphQL funcionando
- Abre: http://localhost:3001/graphql
- Deberías ver GraphQL Playground
- El schema debería estar generado en `graphql/schema.gql`

## 📁 ESTRUCTURA FINAL

```
GraphQL-Taller/
├── marketplaceNestJS/          # REST API (puerto 3000)
│   ├── src/
│   │   ├── app.module.ts       # ✅ Con SubcategoryProductsModule
│   │   ├── products/
│   │   │   └── entities/
│   │   │       └── product.entity.ts  # ✅ Con subcategoryProducts
│   │   └── subcategory-products/  # ✅ Nuevo módulo
│   ├── marketplace.sqlite      # Base de datos
│   └── package.json
│
└── graphql/                    # GraphQL Gateway (puerto 3001)
    ├── app.module.ts           # ✅ Con GraphQLModule + 12 módulos
    ├── main.ts                 # ✅ Puerto 3001, CORS habilitado
    ├── package.json            # ✅ Con dependencias GraphQL
    ├── tsconfig.json           # ✅ Configuración TypeScript
    ├── nest-cli.json           # ✅ Configuración NestJS
    ├── productos/              # ✅ Consume /api/v1/products
    ├── categories/             # ✅ Consume /api/v1/categories
    ├── clients/                # ✅ Consume /api/v1/clients
    ├── sellers/                # ✅ Consume /api/v1/sellers
    ├── orders/                 # ✅ Consume /api/v1/orders
    ├── carts/                  # ✅ Consume /api/v1/carts
    ├── inventories/            # ✅ Consume /api/v1/inventories
    ├── payment-methods/        # ✅ Consume /api/v1/payment-methods
    ├── deliveries/             # ✅ Consume /api/v1/deliveries
    ├── product-orders/         # ✅ Consume /api/v1/product-orders
    ├── product-carts/          # ✅ Consume /api/v1/product-carts
    └── subcategory-products/   # ✅ Consume /api/v1/subcategory-products
```

## 🎯 OPERACIONES DISPONIBLES

### Para CADA entidad GraphQL hay:

**Queries:**
- `<entidades>` - Listar todos (ej: `productos`, `categories`)
- `<entidad>(id)` - Obtener por ID (ej: `producto(id: 1)`)

**Mutations:**
- `create<Entidad>(input)` - Crear
- `update<Entidad>(input)` - Actualizar
- `remove<Entidad>(id)` - Eliminar

**Queries especiales:**
- `productOrdersByOrder(orderId)` - Productos de una orden
- `productCartsByCart(cartId)` - Productos de un carrito
- `subcategoryProductsBySubcategory(subcategoryId)` - Productos por subcategoría
- `subcategoryProductsByProduct(productId)` - Subcategorías de un producto

## ⚠️ SOLUCIÓN A ERRORES COMUNES

### Error: "Cannot find module @nestjs/common"
**Solución:** Ejecuta `npm install` en la carpeta `graphql`

### Error: "ECONNREFUSED localhost:3000"
**Solución:** El servidor REST no está corriendo. Inícialo primero.

### Error: "Port 3001 already in use"
**Solución:** Mata el proceso o cambia el puerto en `main.ts`

### Error: "Schema not generated"
**Solución:** Los módulos deben estar registrados en `app.module.ts`

## 🎓 CUMPLIMIENTO DE RÚBRICA

✅ **Configuración de GraphQL**: Apollo Server + Code-First
✅ **Consumo de REST API**: Todos los servicios usan axios
✅ **Operaciones CRUD**: Todas las entidades tienen queries y mutations
✅ **Relaciones**: Product-Order, Product-Cart, Subcategory-Product
✅ **Manejo de errores**: HttpException en todos los servicios
✅ **Estructura modular**: 12 módulos independientes
✅ **TypeScript**: Todo tipado correctamente
✅ **Playground**: Habilitado para testing

## 📞 DEBUGGING

Si algo no funciona:

1. **Verifica que ambos servidores estén corriendo**
   - REST en puerto 3000
   - GraphQL en puerto 3001

2. **Revisa los logs en la terminal**
   - Los errores aparecen ahí

3. **Verifica la base de datos**
   - `marketplace.sqlite` debe existir en marketplaceNestJS

4. **Prueba la REST API directamente**
   - http://localhost:3000/api/v1/products

5. **Revisa el schema generado**
   - Debería crearse `graphql/schema.gql` automáticamente

## ✨ ¡LISTO PARA USAR!

Una vez que ejecutes `npm install` en la carpeta `graphql` y ambos servidores estén corriendo, tendrás un **gateway GraphQL funcional** consumiendo tu **REST API de marketplace**.

🎉 **Todo implementado según la rúbrica del Taller 5**
