🟦 1. Justificación del Dominio del Sistema

El dominio del sistema se orienta a un portal de exploración turística y reservas de hospedaje. El sistema permite a los clientes visualizar destinos populares organizados por categorías, explorar hoteles disponibles en cada destino, revisar las habitaciones con sus características y comodidades, y finalmente realizar reservas.

El objetivo del sistema es presentar destinos organizados por categorías, permitir al cliente visualizar los hoteles disponibles dentro de cada destino, revisar las habitaciones que componen cada hotel, y gestionar reservas de manera eficiente. El dominio está compuesto por entidades simples, relacionadas de forma jerárquica y coherente con la estructura de navegación y reservas.

---

🟦 2. ENTIDADES DEL SISTEMA

### 2.1 CategoriaDestino
**Propósito:** Categoriza destinos turísticos (Aventura, Relax, Cultural, etc.)

**Campos:**
- `id`: Identificador único
- `nombre`: Nombre de la categoría
- `descripcion`: Descripción breve de la categoría

**Relaciones:** Una categoría puede tener muchos destinos (1:N)

---

### 2.2 Destino
**Propósito:** Representa lugares turísticos disponibles en el sistema

**Campos:**
- `id`: Identificador único
- `nombre`: Nombre del destino
- `descripcion`: Descripción del destino
- `imagen_url`: URL de imagen representativa
- `categoria_id`: Referencia a la categoría (FK)

**Relaciones:**
- Pertenece a una categoría (N:1)
- Contiene múltiples hoteles (1:N)

---

### 2.3 Hotel
**Propósito:** Establecimientos de hospedaje dentro de un destino

**Campos:**
- `id`: Identificador único
- `nombre`: Nombre del hotel
- `descripcion`: Descripción del hotel
- `direccion`: Dirección física
- `imagen_url`: URL de imagen del hotel
- `destino_id`: Referencia al destino (FK)

**Relaciones:**
- Pertenece a un destino (N:1)
- Contiene múltiples habitaciones (1:N)

---

### 2.4 Habitacion
**Propósito:** Unidades de hospedaje dentro de un hotel

**Campos:**
- `id`: Identificador único
- `hotel_id`: Referencia al hotel (FK)
- `categoria`: Tipo de habitación (Suite, Doble, Deluxe, etc.)
- `precio`: Precio por noche
- `capacidad`: Número máximo de huéspedes
- `descripcion`: Descripción de la habitación
- `imagen_url`: URL de imagen
- `wifi`: Disponibilidad de WiFi (boolean)
- `tv`: Disponibilidad de TV (boolean)
- `aire_acondicionado`: Disponibilidad de aire acondicionado (boolean)
- `minibar`: Disponibilidad de minibar (boolean)
- `desayuno_incluido`: Si incluye desayuno (boolean)

**Relaciones:**
- Pertenece a un hotel (N:1)
- Puede tener múltiples reservas (1:N)

---

### 2.5 Cliente
**Propósito:** Usuarios del sistema que realizan reservas

**Campos:**
- `id`: Identificador único
- `nombre`: Nombre del cliente
- `apellido`: Apellido del cliente
- `email`: Correo electrónico (único)
- `telefono`: Teléfono de contacto (opcional)
- `foto_url`: URL de foto del usuario (opcional)

**Relaciones:**
- Puede realizar múltiples reservas (1:N)

---

### 2.6 Reserva
**Propósito:** Registra las reservas de habitaciones realizadas por clientes

**Campos:**
- `id`: Identificador único
- `cliente_id`: Referencia al cliente (FK)
- `habitacion_id`: Referencia a la habitación (FK)
- `fecha_inicio`: Fecha de inicio de la estancia
- `fecha_fin`: Fecha de fin de la estancia
- `total`: Monto total de la reserva
- `estado`: Estado de la reserva (pendiente / confirmada / cancelada)

**Relaciones:**
- Pertenece a un cliente (N:1)
- Pertenece a una habitación (N:1)

---

🟦 3. RELACIONES ENTRE ENTIDADES

### 🟩 Relaciones 1:N (Uno a Muchos)

**1. CategoriaDestino → Destino (1:N)**
- Una categoría puede tener muchos destinos
- Un destino pertenece a una sola categoría
- Implementación: `@OneToMany` en CategoriaDestino, `@ManyToOne` en Destino

**2. Destino → Hotel (1:N)**
- Un destino contiene varios hoteles
- Un hotel está ubicado en un solo destino
- Implementación: `@OneToMany` en Destino, `@ManyToOne` en Hotel

**3. Hotel → Habitacion (1:N)**
- Un hotel tiene varias habitaciones
- Una habitación pertenece solo a un hotel
- Implementación: `@OneToMany` en Hotel, `@ManyToOne` en Habitacion

**4. Cliente → Reserva (1:N)**
- Un cliente puede hacer varias reservas
- Cada reserva pertenece a un cliente
- Implementación: `@OneToMany` en Cliente, `@ManyToOne` en Reserva

**5. Habitacion → Reserva (1:N)**
- Una habitación puede tener muchas reservas (en fechas distintas)
- Cada reserva corresponde a una sola habitación
- Implementación: `@OneToMany` en Habitacion, `@ManyToOne` en Reserva
- **Nota:** Las reservas son históricas y no pueden solaparse en fechas


---

🟦 4. REGLAS DE NEGOCIO

**Regla 1: Unicidad de Email**
- Cada cliente debe tener un email único en el sistema
- No se permiten emails duplicados

**Regla 2: Integridad Referencial**
- Un destino debe pertenecer a una categoría existente
- Un hotel debe pertenecer a un destino existente
- Una habitación debe pertenecer a un hotel existente
- Una reserva debe referenciar a un cliente y una habitación existentes

**Regla 3: Validación de Fechas de Reserva**
- La fecha de fin debe ser posterior a la fecha de inicio
- Una habitación no puede tener reservas con fechas solapadas (excepto las canceladas)
- Se valida disponibilidad antes de crear una reserva

**Regla 4: Cálculo de Total de Reserva**
- El total se calcula como: precio_habitación × número_de_noches
- El número de noches es la diferencia entre fecha_fin y fecha_inicio

**Regla 5: Estados de Reserva**
- Las reservas tienen tres estados posibles: `pendiente`, `confirmada`, `cancelada`
- Estado por defecto al crear una reserva: `pendiente`
- Los servicios incluyen métodos para confirmar y cancelar reservas

**Regla 6: Información Completa de Reserva**
- Una reserva debe incluir obligatoriamente: cliente_id, habitacion_id, fecha_inicio, fecha_fin y total



---

🟦 5. IMPLEMENTACIÓN TÉCNICA

### Stack Tecnológico
- **Framework:** NestJS
- **Validación:** class-validator y class-transformer
- **Arquitectura:** Servicios con validaciones puras

> **Nota:** Los servicios contienen **únicamente validaciones de lógica de negocio**. No incluyen almacenamiento ni operaciones de base de datos. La persistencia se implementará posteriormente.

### Arquitectura Actual

**Entidades:**
- Definen la estructura de datos con decoradores de TypeORM (preparadas para migración futura)
- Incluyen relaciones entre entidades (1:N, N:1)
- Documentan el modelo de dominio

**DTOs (Data Transfer Objects):**
- `@IsString()`, `@IsNumber()`, `@IsBoolean()`, `@IsDateString()`: Validación de tipos
- `@IsNotEmpty()`: Campo obligatorio
- `@IsOptional()`: Campo opcional
- `@IsEmail()`: Validación de email
- `@MaxLength()`: Longitud máxima
- `@Min()`: Valor mínimo
- `@IsIn()`: Valores permitidos

**Servicios:**

Los servicios implementan:
- ✅ **CRUD completo** usando repositorios de TypeORM
- ✅ **Validaciones de negocio** antes de operaciones
- ✅ **Endpoints especializados** según la lógica del dominio
- ✅ **Manejo de relaciones** entre entidades

### Funcionalidades por Servicio

**CategoriasDestinosService:**
```typescript
# CRUD
✅ create(dto): Crear categoría
✅ findAll(): Obtener todas las categorías
✅ findOne(id): Obtener una categoría
✅ update(id, dto): Actualizar categoría
✅ remove(id): Eliminar categoría

# Validaciones
✅ validarNombre(nombre): Verifica que no esté vacío
✅ validarDescripcion(descripcion): Verifica que no esté vacía

# Endpoints Especializados
✅ getDestinosByCategoria(id): Obtener destinos de una categoría
```

**DestinosService:**
```typescript
# CRUD
✅ create(dto): Crear destino
✅ findAll(): Obtener todos los destinos
✅ findOne(id): Obtener un destino
✅ update(id, dto): Actualizar destino
✅ remove(id): Eliminar destino

# Validaciones
✅ validarCategoriaId(categoria_id): Verifica que sea válido
✅ validarNombre(nombre): Verifica que no esté vacío

# Endpoints Especializados
✅ getHotelesByDestino(id): Obtener hoteles de un destino
✅ findByCategoria(categoria_id): Buscar destinos por categoría
```

**HotelesService:**
```typescript
# CRUD
✅ create(dto): Crear hotel
✅ findAll(): Obtener todos los hoteles
✅ findOne(id): Obtener un hotel
✅ update(id, dto): Actualizar hotel
✅ remove(id): Eliminar hotel

# Validaciones
✅ validarDestinoId(destino_id): Verifica que sea válido
✅ validarNombre(nombre): Verifica que no esté vacío
✅ validarDireccion(direccion): Verifica que no esté vacía

# Endpoints Especializados
✅ getHabitacionesByHotel(id): Obtener habitaciones de un hotel
✅ findByDestino(destino_id): Buscar hoteles por destino
```

**HabitacionesService:**
```typescript
# CRUD
✅ create(dto): Crear habitación
✅ findAll(): Obtener todas las habitaciones
✅ findOne(id): Obtener una habitación
✅ update(id, dto): Actualizar habitación
✅ remove(id): Eliminar habitación

# Validaciones
✅ validarHotelId(hotel_id): Verifica que sea válido
✅ validarPrecio(precio): Verifica que sea mayor a 0
✅ validarCapacidad(capacidad): Verifica que sea al menos 1
✅ validarCategoria(categoria): Verifica que no esté vacía

# Endpoints Especializados
✅ checkDisponibilidad(id, fechas): Verificar disponibilidad
✅ findByHotel(hotel_id): Buscar habitaciones por hotel
```

**ClientesService:**
```typescript
# CRUD
✅ create(dto): Crear cliente
✅ findAll(): Obtener todos los clientes
✅ findOne(id): Obtener un cliente
✅ update(id, dto): Actualizar cliente
✅ remove(id): Eliminar cliente

# Validaciones
✅ validarFormatoEmail(email): Verifica formato correcto
✅ validarEmailUnico(email): Verifica unicidad en BD
✅ validarNombre(nombre): Verifica que no esté vacío
✅ validarApellido(apellido): Verifica que no esté vacío
✅ validarTelefono(telefono): Verifica formato (opcional)

# Endpoints Especializados
✅ getReservasByCliente(id): Obtener reservas de un cliente
✅ findByEmail(email): Buscar cliente por email
```

**ReservasService:**
```typescript
# CRUD
✅ create(dto): Crear reserva
✅ findAll(): Obtener todas las reservas
✅ findOne(id): Obtener una reserva
✅ update(id, dto): Actualizar reserva
✅ remove(id): Eliminar reserva

# Validaciones
✅ validarFechas(inicio, fin): Verifica que fin > inicio
✅ validarFechasNoEnPasado(fecha_inicio): No fechas pasadas
✅ validarDisponibilidad(): Verifica no solapamiento en BD
✅ validarEstado(estado): Verifica estados válidos
✅ calcularTotal(inicio, fin, precio): Calcula precio total

# Endpoints Especializados
✅ confirmar(id): Confirmar reserva
✅ cancelar(id): Cancelar reserva
✅ findByCliente(cliente_id): Reservas por cliente
✅ findByHabitacion(habitacion_id): Reservas por habitación
```

### Manejo de Errores

El sistema utiliza excepciones de NestJS:
- `BadRequestException`: Validaciones de negocio fallidas
- `NotFoundException`: Entidades no encontradas en BD
- `ConflictException`: Conflictos de unicidad (ej: email duplicado)
- Mensajes descriptivos en español para cada error

---

🟦 6. INSTALACIÓN Y USO

### Requisitos Previos
- Node.js v18 o superior
- npm o yarn

### Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run start:dev
```

### Base de Datos

El proyecto utiliza **SQLite** con TypeORM:
- **Base de datos:** `hoteleria.db` (se crea automáticamente)
- **Sincronización automática:** Las tablas se crean al iniciar
- **Logging SQL:** Activado para ver las queries en consola

### Configuración de TypeORM (app.module.ts)

```typescript
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'hoteleria.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,  // Solo para desarrollo
  logging: true,
})
```

### Endpoints Disponibles

La aplicación expone una API REST completa en `http://localhost:3000`:

- **Categorías:** `/categorias-destinos`
- **Destinos:** `/destinos`
- **Hoteles:** `/hoteles`
- **Habitaciones:** `/habitaciones`
- **Clientes:** `/clientes`
- **Reservas:** `/reservas`

Ver `API_DOCUMENTATION.md` para detalles completos de cada endpoint.

---

🟦 7. ESTRUCTURA DEL PROYECTO

```
src/
├── categorias_destinos/
│   ├── dto/
│   │   ├── create-categorias_destino.dto.ts
│   │   └── update-categorias_destino.dto.ts
│   ├── entities/
│   │   └── categorias_destino.entity.ts
│   ├── categorias_destinos.controller.ts
│   ├── categorias_destinos.service.ts
│   └── categorias_destinos.module.ts
├── destinos/
│   ├── dto/
│   ├── entities/
│   ├── destinos.controller.ts
│   ├── destinos.service.ts
│   └── destinos.module.ts
├── hoteles/
│   ├── dto/
│   ├── entities/
│   ├── hoteles.controller.ts
│   ├── hoteles.service.ts
│   └── hoteles.module.ts
├── habitaciones/
│   ├── dto/
│   ├── entities/
│   ├── habitaciones.controller.ts
│   ├── habitaciones.service.ts
│   └── habitaciones.module.ts
├── clientes/
│   ├── dto/
│   ├── entities/
│   ├── clientes.controller.ts
│   ├── clientes.service.ts
│   └── clientes.module.ts
├── reservas/
│   ├── dto/
│   ├── entities/
│   ├── reservas.controller.ts
│   ├── reservas.service.ts
│   └── reservas.module.ts
├── app.module.ts
├── main.ts
└── API_DOCUMENTATION.md (Documentación completa de la API)
```