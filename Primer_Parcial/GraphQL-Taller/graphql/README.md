# GraphQL Gateway - Marketplace

## 📋 Descripción
Gateway GraphQL que consume la API REST de marketplaceNestJS (Taller 4).

## 🚀 Instalación

### 1. Instalar dependencias del proyecto GraphQL
```powershell
cd graphql
npm install
```

### 2. Instalar dependencias del proyecto REST (si no lo has hecho)
```powershell
cd ..\marketplaceNestJS
npm install
```

## ▶️ Ejecución

### 1. Iniciar el servidor REST (puerto 3000)
```powershell
cd marketplaceNestJS
npm run start:dev
```

### 2. Iniciar el servidor GraphQL (puerto 3001)
```powershell
cd graphql
npm run start:dev
```

## 🌐 Acceso

- **REST API**: http://localhost:3000/api/v1
- **GraphQL Playground**: http://localhost:3001/graphql

## 📁 Estructura del Proyecto GraphQL

```
graphql/
├── app.module.ts           # Módulo principal con GraphQLModule
├── main.ts                 # Punto de entrada de la aplicación
├── productos/              # Módulo de productos
│   ├── productos.module.ts
│   ├── productos.resolver.ts
│   ├── productos.service.ts  # Consume REST API
│   ├── entities/
│   │   └── producto.entity.ts  # @ObjectType
│   └── dto/
│       ├── create-producto.input.ts  # @InputType
│       └── update-producto.input.ts
├── categories/
├── clients/
├── sellers/
├── orders/
├── carts/
├── inventories/
├── payment-methods/
├── deliveries/
├── product-orders/
├── product-carts/
└── subcategory-products/
```

## 🔧 Configuración

### GraphQL
- **Puerto**: 3001
- **Driver**: Apollo Server
- **Schema**: Code-First (auto-generado en `schema.gql`)
- **Playground**: Habilitado

### REST API
- **Puerto**: 3000
- **Prefijo**: `/api/v1`
- **Base de datos**: SQLite (marketplace.sqlite)

## ✅ Funcionalidades Implementadas

### Entidades GraphQL
- [x] Products (Productos)
- [x] Categories (Categorías)
- [x] Clients (Clientes)
- [x] Sellers (Vendedores)
- [x] Orders (Órdenes)
- [x] Carts (Carritos)
- [x] Inventories (Inventarios)
- [x] Payment Methods (Métodos de Pago)
- [x] Deliveries (Entregas)
- [x] Product Orders (Relación Producto-Orden)
- [x] Product Carts (Relación Producto-Carrito)
- [x] Subcategory Products (Relación Subcategoría-Producto)

### Operaciones disponibles (por cada entidad)
- **Queries**:
  - `findAll()` - Obtener todos
  - `findOne(id)` - Obtener por ID
- **Mutations**:
  - `create(input)` - Crear nuevo
  - `update(input)` - Actualizar existente
  - `remove(id)` - Eliminar

## 📝 Ejemplo de Query GraphQL

```graphql
# Obtener todos los productos
query {
  productos {
    id_product
    product_name
    description
    price
    stock
  }
}

# Obtener un producto por ID
query {
  producto(id: 1) {
    id_product
    product_name
    price
    stock
  }
}

# Crear un producto
mutation {
  createProducto(createProductoInput: {
    product_name: "Laptop"
    description: "Laptop HP"
    price: 999.99
    stock: 10
  }) {
    id_product
    product_name
  }
}
```

## 🔗 Integración REST-GraphQL

Cada servicio de GraphQL consume la API REST correspondiente:

- `ProductosService` → `http://localhost:3000/api/v1/products`
- `CategoriesService` → `http://localhost:3000/api/v1/categories`
- `ClientsService` → `http://localhost:3000/api/v1/clients`
- Y así sucesivamente...

## ⚠️ Notas Importantes

1. **Orden de inicio**: Primero inicia el servidor REST (puerto 3000), luego el GraphQL (puerto 3001)
2. **Dependencias**: El servidor GraphQL depende completamente del REST
3. **Errores**: Los errores de la API REST se propagan al cliente GraphQL
4. **TypeScript**: Los errores de compilación son normales hasta que ejecutes `npm install`

## 🛠️ Comandos Útiles

```powershell
# Instalar dependencias
npm install

# Desarrollo (con hot-reload)
npm run start:dev

# Producción
npm run build
npm run start:prod

# Formato de código
npm run format

# Linting
npm run lint
```

## 📚 Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **GraphQL** - Lenguaje de consulta
- **Apollo Server** - Servidor GraphQL
- **Axios** - Cliente HTTP para consumir REST API
- **TypeScript** - Lenguaje de programación
- **Code-First** - Generación automática de schema

## 👥 Autor

Taller 5 - GraphQL con NestJS
