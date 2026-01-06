# 📝 EJEMPLOS DE QUERIES Y MUTATIONS GRAPHQL

## 🔍 PRODUCTOS

### Listar todos los productos
```graphql
query {
  productos {
    id_product
    product_name
    description
    price
    stock
    photo
    created_at
  }
}
```

### Obtener un producto por ID
```graphql
query {
  producto(id: 1) {
    id_product
    product_name
    description
    price
    stock
  }
}
```

### Crear un producto
```graphql
mutation {
  createProducto(createProductoInput: {
    product_name: "Laptop Gaming"
    description: "Laptop HP Omen 15"
    price: 1299.99
    stock: 5
    id_seller: 1
    id_category: 1
  }) {
    id_product
    product_name
    price
  }
}
```

### Actualizar un producto
```graphql
mutation {
  updateProducto(updateProductoInput: {
    id: 1
    price: 1199.99
    stock: 10
  }) {
    id_product
    product_name
    price
    stock
  }
}
```

### Eliminar un producto
```graphql
mutation {
  removeProducto(id: 1) {
    id_product
    product_name
  }
}
```

## 📁 CATEGORÍAS

### Listar todas las categorías
```graphql
query {
  categories {
    id_category
    category_name
    description
    created_at
  }
}
```

### Crear una categoría
```graphql
mutation {
  createCategory(createCategoryInput: {
    category_name: "Electrónica"
    description: "Productos electrónicos"
  }) {
    id_category
    category_name
  }
}
```

## 👤 CLIENTES

### Listar todos los clientes
```graphql
query {
  clients {
    id_client
    name
    email
    phone
    address
    created_at
  }
}
```

### Crear un cliente
```graphql
mutation {
  createClient(createClientInput: {
    name: "Juan Pérez"
    email: "juan@example.com"
    phone: "0999999999"
    address: "Av. Principal 123"
  }) {
    id_client
    name
    email
  }
}
```

## 🏪 VENDEDORES

### Listar vendedores
```graphql
query {
  sellers {
    id_seller
    name
    email
    phone
    business_name
    created_at
  }
}
```

### Crear vendedor
```graphql
mutation {
  createSeller(createSellerInput: {
    name: "María López"
    email: "maria@tienda.com"
    phone: "0988888888"
    business_name: "Tech Store"
  }) {
    id_seller
    name
    business_name
  }
}
```

## 📦 ÓRDENES

### Listar órdenes
```graphql
query {
  orders {
    id_order
    id_client
    total
    status
    order_date
    created_at
  }
}
```

### Crear orden
```graphql
mutation {
  createOrder(createOrderInput: {
    id_client: 1
    total: 199.99
    status: "pending"
  }) {
    id_order
    total
    status
  }
}
```

## 🛒 CARRITOS

### Listar carritos
```graphql
query {
  carts {
    id_cart
    id_client
    status
    created_at
  }
}
```

### Crear carrito
```graphql
mutation {
  createCart(createCartInput: {
    id_client: 1
    status: "active"
  }) {
    id_cart
    id_client
    status
  }
}
```

## 📊 INVENTARIOS

### Listar inventarios
```graphql
query {
  inventories {
    id_inventory
    id_product
    quantity
    location
    created_at
  }
}
```

### Crear inventario
```graphql
mutation {
  createInventory(createInventoryInput: {
    id_product: 1
    quantity: 100
    location: "Bodega A"
  }) {
    id_inventory
    quantity
    location
  }
}
```

## 💳 MÉTODOS DE PAGO

### Listar métodos de pago
```graphql
query {
  paymentMethods {
    id_payment_method
    method_name
    description
    is_active
    created_at
  }
}
```

### Crear método de pago
```graphql
mutation {
  createPaymentMethod(createPaymentMethodInput: {
    method_name: "Tarjeta de Crédito"
    description: "Visa/Mastercard"
    is_active: true
  }) {
    id_payment_method
    method_name
  }
}
```

## 🚚 ENTREGAS

### Listar entregas
```graphql
query {
  deliveries {
    id_delivery
    id_order
    status
    address
    delivery_date
    created_at
  }
}
```

### Crear entrega
```graphql
mutation {
  createDelivery(createDeliveryInput: {
    id_order: 1
    status: "pending"
    address: "Calle Principal 456"
    delivery_date: "2025-10-25"
  }) {
    id_delivery
    status
    delivery_date
  }
}
```

## 🔗 RELACIONES TRANSACCIONALES

### Productos en una Orden
```graphql
query {
  productOrdersByOrder(orderId: 1) {
    id_product_order
    id_order
    id_product
    quantity
    unit_price
    subtotal
  }
}
```

### Crear producto en orden
```graphql
mutation {
  createProductOrder(createProductOrderInput: {
    id_order: 1
    id_product: 1
    quantity: 2
    unit_price: 99.99
    subtotal: 199.98
  }) {
    id_product_order
    quantity
    subtotal
  }
}
```

### Productos en un Carrito
```graphql
query {
  productCartsByCart(cartId: 1) {
    id_product_cart
    id_cart
    id_product
    quantity
  }
}
```

### Agregar producto al carrito
```graphql
mutation {
  createProductCart(createProductCartInput: {
    id_cart: 1
    id_product: 1
    quantity: 3
  }) {
    id_product_cart
    quantity
  }
}
```

### Subcategorías de un Producto
```graphql
query {
  subcategoryProductsByProduct(productId: 1) {
    id
    subcategoryId
    productId
    createdAt
  }
}
```

### Productos de una Subcategoría
```graphql
query {
  subcategoryProductsBySubcategory(subcategoryId: 1) {
    id
    subcategoryId
    productId
    createdAt
  }
}
```

### Crear relación Subcategoría-Producto
```graphql
mutation {
  createSubcategoryProduct(createSubcategoryProductInput: {
    subcategoryId: 1
    productId: 1
  }) {
    id
    subcategoryId
    productId
  }
}
```

## 🔄 QUERIES COMBINADAS

### Obtener producto con detalles
```graphql
query {
  producto(id: 1) {
    id_product
    product_name
    price
    stock
    id_category
    id_seller
  }
  
  categories {
    id_category
    category_name
  }
  
  sellers {
    id_seller
    name
    business_name
  }
}
```

### Obtener orden completa
```graphql
query {
  order(id: 1) {
    id_order
    total
    status
    order_date
  }
  
  productOrdersByOrder(orderId: 1) {
    id_product
    quantity
    unit_price
    subtotal
  }
}
```

## 💡 TIPS

1. **Variables**: Puedes usar variables en GraphQL Playground:
```graphql
query GetProducto($id: Int!) {
  producto(id: $id) {
    id_product
    product_name
    price
  }
}
```

Variables:
```json
{
  "id": 1
}
```

2. **Alias**: Para consultas múltiples del mismo tipo:
```graphql
query {
  producto1: producto(id: 1) {
    product_name
  }
  producto2: producto(id: 2) {
    product_name
  }
}
```

3. **Fragments**: Para reutilizar campos:
```graphql
fragment ProductoBasico on Producto {
  id_product
  product_name
  price
}

query {
  productos {
    ...ProductoBasico
  }
}
```

## 🎯 TESTING COMPLETO

Para probar que todo funciona, ejecuta estas queries en orden:

1. Crear categoría
2. Crear vendedor
3. Crear producto (con id_category e id_seller)
4. Crear cliente
5. Crear carrito (con id_client)
6. Agregar producto al carrito
7. Crear orden (con id_client)
8. Agregar productos a la orden
9. Crear entrega (con id_order)

¡Esto probará todo el flujo del marketplace!
