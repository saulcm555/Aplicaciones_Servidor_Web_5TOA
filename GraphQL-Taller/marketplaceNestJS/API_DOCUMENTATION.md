# Backend Marketplace - API Documentation

## 📋 Descripción

Backend de un marketplace desarrollado con NestJS y TypeORM, conectado a PostgreSQL. Incluye gestión completa de clientes, carritos, órdenes, deliveries y productos.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Configurar la base de datos en .env
```

## 🗄️ Base de Datos

El proyecto usa PostgreSQL. Asegúrate de tener una base de datos llamada `marketplace` creada.

```sql
CREATE DATABASE marketplace;
```

## 🏃 Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Endpoints API

### **Clients** (`/clients`)

#### Crear cliente
```http
POST /clients
Content-Type: application/json

{
  "client_name": "Juan Pérez",
  "client_email": "juan@example.com",
  "client_password": "password123",
  "phone": "0999999999",
  "address": "Av. Principal 123"
}
```

#### Listar todos los clientes
```http
GET /clients
```

#### Obtener un cliente
```http
GET /clients/:id
```

#### Actualizar cliente
```http
PATCH /clients/:id
Content-Type: application/json

{
  "phone": "0988888888",
  "address": "Nueva dirección"
}
```

#### Eliminar cliente
```http
DELETE /clients/:id
```

---

### **Carts** (`/carts`)

#### Crear carrito
```http
POST /carts
Content-Type: application/json

{
  "id_client": 1,
  "status": "active"
}
```

#### Listar todos los carritos
```http
GET /carts
```

#### Obtener un carrito con sus productos
```http
GET /carts/:id
```

#### Agregar producto al carrito
```http
POST /carts/:cartId/items
Content-Type: application/json

{
  "id_product": 5,
  "quantity": 2
}
```

#### Listar items del carrito
```http
GET /carts/:cartId/items
```

#### Eliminar producto del carrito
```http
DELETE /carts/:cartId/items/:productId
```

#### Actualizar carrito
```http
PATCH /carts/:id
Content-Type: application/json

{
  "status": "completed"
}
```

#### Eliminar carrito
```http
DELETE /carts/:id
```

---

### **Orders** (`/orders`)

#### Crear orden
```http
POST /orders
Content-Type: application/json

{
  "id_client": 1,
  "id_cart": 2,
  "id_payment_method": 1,
  "total_amount": 150.50,
  "status": "pending",
  "delivery_date": "2025-10-20"
}
```

#### Listar todas las órdenes
```http
GET /orders
```

#### Obtener una orden
```http
GET /orders/:id
```

#### Actualizar orden
```http
PATCH /orders/:id
Content-Type: application/json

{
  "total_amount": 175.00,
  "delivery_date": "2025-10-22"
}
```

#### Actualizar status de la orden
```http
PATCH /orders/:id/status
Content-Type: application/json

{
  "status": "completed"
}
```

**Estados posibles**: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

#### Eliminar orden
```http
DELETE /orders/:id
```

---

### **Product Carts** (`/product-carts`)

#### Crear relación producto-carrito
```http
POST /product-carts
Content-Type: application/json

{
  "id_product": 3,
  "id_cart": 1,
  "quantity": 5
}
```

#### Listar todas las relaciones
```http
GET /product-carts
```

#### Obtener una relación
```http
GET /product-carts/:id
```

#### Actualizar relación
```http
PATCH /product-carts/:id
Content-Type: application/json

{
  "quantity": 10
}
```

#### Eliminar relación
```http
DELETE /product-carts/:id
```

---

### **Product Orders** (`/product-orders`)

#### Crear relación producto-orden
```http
POST /product-orders
Content-Type: application/json

{
  "id_order": 1,
  "id_product": 5,
  "price_unit": 25.50,
  "quantity": 3,
  "subtotal": 76.50
}
```

#### Listar todas las relaciones
```http
GET /product-orders
```

#### Obtener una relación
```http
GET /product-orders/:id
```

#### Actualizar relación
```http
PATCH /product-orders/:id
Content-Type: application/json

{
  "quantity": 5,
  "subtotal": 127.50
}
```

#### Eliminar relación
```http
DELETE /product-orders/:id
```

---

### **Deliveries** (`/deliveries`)

#### Crear delivery
```http
POST /deliveries
Content-Type: application/json

{
  "id_order": 1,
  "id_product": 3,
  "delivery_address": "Calle Falsa 123",
  "city": "Quito",
  "status": "pending",
  "estimated_time": "2025-10-18T10:00:00Z",
  "delivery_person": "Carlos Ruiz",
  "delivery_cost": 5.00
}
```

#### Listar todos los deliveries
```http
GET /deliveries
```

#### Obtener un delivery
```http
GET /deliveries/:id
```

#### Actualizar delivery
```http
PATCH /deliveries/:id
Content-Type: application/json

{
  "status": "in_transit",
  "delivery_person": "María López"
}
```

**Estados posibles**: `pending`, `in_transit`, `delivered`, `failed`

#### Eliminar delivery
```http
DELETE /deliveries/:id
```

---

## 🗂️ Estructura de Entidades

### Client
- `id_client` (PK)
- `client_name`
- `client_email` (unique)
- `client_password`
- `phone`
- `address`
- `created_at`
- **Relaciones**: Tiene muchos `carts` y `orders`

### Cart
- `id_cart` (PK)
- `id_client` (FK)
- `status`
- `created_at`
- `updated_at`
- **Relaciones**: Pertenece a `client`, tiene muchos `productCarts`

### ProductCart (Tabla puente)
- `id_product_cart` (PK)
- `id_product` (FK)
- `id_cart` (FK)
- `quantity`
- `added_at`
- **Relaciones**: Pertenece a `cart` y `product`

### Order
- `id_order` (PK)
- `order_date`
- `status`
- `total_amount`
- `delivery_date`
- `id_client` (FK)
- `id_cart` (FK)
- `id_payment_method` (FK)
- `created_at`
- **Relaciones**: Pertenece a `client`, `cart`, `paymentMethod`; tiene muchos `productOrders` y uno `delivery`

### ProductOrder (Tabla puente)
- `id_product_order` (PK)
- `id_order` (FK)
- `id_product` (FK)
- `price_unit`
- `quantity`
- `subtotal`
- `created_at`
- **Relaciones**: Pertenece a `order` y `product`

### Delivery
- `id_delivery` (PK)
- `id_product` (FK, opcional)
- `id_order` (FK)
- `delivery_address`
- `city`
- `status`
- `estimated_time`
- `delivery_person`
- `delivery_cost`
- `created_at`
- **Relaciones**: Pertenece a `order`

### Product
- `id_product` (PK)
- `id_seller` (FK)
- `id_category` (FK)
- `id_sub_category` (FK)
- `product_name`
- `description`
- `price`
- `stock`
- `photo`
- `created_at`
- **Relaciones**: Tiene muchos `productCarts` y `productOrders`

### PaymentMethod
- `id_payment_method` (PK)
- `method_name`
- `details_payment`
- **Relaciones**: Tiene muchos `orders`

---

## 🔄 Flujo de trabajo típico

### 1. Crear un cliente
```bash
POST /clients
```

### 2. Crear un carrito para el cliente
```bash
POST /carts
```

### 3. Agregar productos al carrito
```bash
POST /carts/:cartId/items
```

### 4. Crear una orden desde el carrito
```bash
POST /orders
```

### 5. Crear las relaciones de productos en la orden
```bash
POST /product-orders
```

### 6. Crear el delivery para la orden
```bash
POST /deliveries
```

### 7. Actualizar el estado de la orden
```bash
PATCH /orders/:id/status
```

---

## 🛠️ Tecnologías

- **NestJS** - Framework backend
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de datos

---

## 📝 Notas

- La configuración `synchronize: true` de TypeORM está habilitada solo para desarrollo
- En producción, se recomienda usar migraciones en lugar de sincronización automática
- Todos los endpoints retornan JSON
- Los errores siguen el formato estándar de NestJS

---

## 🔐 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=marketplace
PORT=3000
```

---

## 📄 Licencia

MIT
