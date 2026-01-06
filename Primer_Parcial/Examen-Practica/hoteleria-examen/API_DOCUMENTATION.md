# 📘 Documentación API REST - Sistema de Hotelería

## 🌐 Base URL
```
http://localhost:3000
```

---

## 📋 Categorías de Destinos

### CRUD Básico

**POST** `/categorias-destinos`
Crear nueva categoría de destino
```json
{
  "nombre": "Aventura",
  "descripcion": "Destinos para actividades extremas"
}
```

**GET** `/categorias-destinos`
Listar todas las categorías

**GET** `/categorias-destinos/:id`
Obtener una categoría específica

**PATCH** `/categorias-destinos/:id`
Actualizar una categoría
```json
{
  "nombre": "Aventura Extrema",
  "descripcion": "Destinos para deportes extremos"
}
```

**DELETE** `/categorias-destinos/:id`
Eliminar una categoría

### Endpoint Especializado

**GET** `/categorias-destinos/:id/destinos`
Obtener todos los destinos de una categoría específica

---

## 🗺️ Destinos

### CRUD Básico

**POST** `/destinos`
Crear nuevo destino
```json
{
  "nombre": "Machu Picchu",
  "descripcion": "Antigua ciudad inca",
  "imagen_url": "https://...",
  "categoria_id": 1
}
```

**GET** `/destinos`
Listar todos los destinos

**GET** `/destinos?categoria_id=1`
Filtrar destinos por categoría (endpoint especializado como query param)

**GET** `/destinos/:id`
Obtener un destino específico

**PATCH** `/destinos/:id`
Actualizar un destino

**DELETE** `/destinos/:id`
Eliminar un destino

### Endpoint Especializado

**GET** `/destinos/:id/hoteles`
Obtener todos los hoteles de un destino específico

---

## 🏨 Hoteles

### CRUD Básico

**POST** `/hoteles`
Crear nuevo hotel
```json
{
  "nombre": "Hotel Sanctuary Lodge",
  "descripcion": "Hotel exclusivo frente a Machu Picchu",
  "direccion": "Carretera Hiram Bingham, Aguas Calientes",
  "imagen_url": "https://...",
  "destino_id": 1
}
```

**GET** `/hoteles`
Listar todos los hoteles

**GET** `/hoteles?destino_id=1`
Filtrar hoteles por destino (endpoint especializado como query param)

**GET** `/hoteles/:id`
Obtener un hotel específico

**PATCH** `/hoteles/:id`
Actualizar un hotel

**DELETE** `/hoteles/:id`
Eliminar un hotel

### Endpoint Especializado

**GET** `/hoteles/:id/habitaciones`
Obtener todas las habitaciones de un hotel específico

---

## 🛏️ Habitaciones

### CRUD Básico

**POST** `/habitaciones`
Crear nueva habitación
```json
{
  "hotel_id": 1,
  "categoria": "Suite Deluxe",
  "precio": 350.00,
  "capacidad": 2,
  "descripcion": "Suite con vista panorámica",
  "imagen_url": "https://...",
  "wifi": true,
  "tv": true,
  "aire_acondicionado": true,
  "minibar": true,
  "desayuno_incluido": true
}
```

**GET** `/habitaciones`
Listar todas las habitaciones

**GET** `/habitaciones?hotel_id=1`
Filtrar habitaciones por hotel (endpoint especializado como query param)

**GET** `/habitaciones/:id`
Obtener una habitación específica

**PATCH** `/habitaciones/:id`
Actualizar una habitación

**DELETE** `/habitaciones/:id`
Eliminar una habitación

### Endpoint Especializado

**GET** `/habitaciones/:id/disponibilidad?fecha_inicio=2024-12-01&fecha_fin=2024-12-05`
Verificar disponibilidad de una habitación para fechas específicas

Respuesta:
```json
{
  "habitacion_id": 1,
  "disponible": true,
  "mensaje": "Habitación disponible para las fechas solicitadas"
}
```

---

## 👥 Clientes

### CRUD Básico

**POST** `/clientes`
Crear nuevo cliente
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan.perez@email.com",
  "telefono": "+51 987654321",
  "foto_url": "https://..."
}
```
Validaciones:
- Email debe ser único
- Email debe tener formato válido
- Teléfono es opcional pero debe tener formato válido si se proporciona

**GET** `/clientes`
Listar todos los clientes

**GET** `/clientes?email=juan.perez@email.com`
Buscar cliente por email (endpoint especializado como query param)

**GET** `/clientes/:id`
Obtener un cliente específico

**PATCH** `/clientes/:id`
Actualizar un cliente

**DELETE** `/clientes/:id`
Eliminar un cliente

### Endpoint Especializado

**GET** `/clientes/:id/reservas`
Obtener todas las reservas de un cliente específico

---

## 📅 Reservas

### CRUD Básico

**POST** `/reservas`
Crear nueva reserva
```json
{
  "cliente_id": 1,
  "habitacion_id": 1,
  "fecha_inicio": "2024-12-01",
  "fecha_fin": "2024-12-05",
  "total": 1400.00,
  "estado": "pendiente"
}
```

Validaciones automáticas:
- fecha_fin debe ser posterior a fecha_inicio
- No se permiten reservas en el pasado
- Verifica disponibilidad (no solapamiento de fechas)
- Calcula el total automáticamente si no se proporciona
- Estado por defecto: "pendiente"

**GET** `/reservas`
Listar todas las reservas

**GET** `/reservas?cliente_id=1`
Filtrar reservas por cliente (endpoint especializado como query param)

**GET** `/reservas?habitacion_id=1`
Filtrar reservas por habitación (endpoint especializado como query param)

**GET** `/reservas/:id`
Obtener una reserva específica

**PATCH** `/reservas/:id`
Actualizar una reserva

**DELETE** `/reservas/:id`
Eliminar una reserva

### Endpoints Especializados

**PATCH** `/reservas/:id/confirmar`
Confirmar una reserva (cambia estado a "confirmada")

Validación: No se puede confirmar una reserva cancelada

**PATCH** `/reservas/:id/cancelar`
Cancelar una reserva (cambia estado a "cancelada")

---

## 🔐 Validaciones Generales

### DTOs con class-validator

Todos los endpoints POST y PATCH incluyen validaciones automáticas:

**Categorías/Destinos/Hoteles:**
- `@IsString()` - Validación de tipo string
- `@IsNotEmpty()` - Campo obligatorio
- `@MaxLength(n)` - Longitud máxima

**Habitaciones:**
- `@IsNumber()` - Validación de tipo numérico
- `@Min(0)` - Precio debe ser >= 0
- `@Min(1)` - Capacidad debe ser >= 1
- `@IsBoolean()` - Validación de amenidades

**Clientes:**
- `@IsEmail()` - Formato de email válido
- Regex para teléfono: `/^[0-9+\-\s()]{7,20}$/`

**Reservas:**
- `@IsDateString()` - Formato de fecha válido
- `@IsIn(['pendiente', 'confirmada', 'cancelada'])` - Estados válidos
- Lógica de negocio para disponibilidad

---

## 📊 Estados de Respuesta HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Validación fallida |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Email duplicado (clientes) |

---

## 🎯 Ejemplos de Uso

### Flujo Completo: Crear una Reserva

1. **Crear categoría**
```bash
POST /categorias-destinos
{
  "nombre": "Relax",
  "descripcion": "Destinos para descansar"
}
# Respuesta: id = 1
```

2. **Crear destino**
```bash
POST /destinos
{
  "nombre": "Cusco",
  "descripcion": "Ciudad histórica",
  "categoria_id": 1
}
# Respuesta: id = 1
```

3. **Crear hotel**
```bash
POST /hoteles
{
  "nombre": "Hotel Plaza",
  "descripcion": "Hotel céntrico",
  "direccion": "Plaza de Armas 123",
  "destino_id": 1
}
# Respuesta: id = 1
```

4. **Crear habitación**
```bash
POST /habitaciones
{
  "hotel_id": 1,
  "categoria": "Suite",
  "precio": 200,
  "capacidad": 2,
  "descripcion": "Suite matrimonial",
  "wifi": true,
  "tv": true
}
# Respuesta: id = 1
```

5. **Verificar disponibilidad**
```bash
GET /habitaciones/1/disponibilidad?fecha_inicio=2024-12-01&fecha_fin=2024-12-05
# Respuesta: {"disponible": true}
```

6. **Crear cliente**
```bash
POST /clientes
{
  "nombre": "María",
  "apellido": "García",
  "email": "maria@email.com"
}
# Respuesta: id = 1
```

7. **Crear reserva**
```bash
POST /reservas
{
  "cliente_id": 1,
  "habitacion_id": 1,
  "fecha_inicio": "2024-12-01",
  "fecha_fin": "2024-12-05",
  "total": 800
}
# Respuesta: id = 1, estado = "pendiente"
```

8. **Confirmar reserva**
```bash
PATCH /reservas/1/confirmar
# Respuesta: estado = "confirmada"
```

---

## 🚀 Características Implementadas

✅ CRUD completo en todas las entidades
✅ Validaciones con class-validator en DTOs
✅ Endpoints especializados basados en el dominio
✅ Almacenamiento en memoria (persistencia temporal)
✅ Validaciones de lógica de negocio
✅ Relaciones entre entidades documentadas
✅ Manejo de errores con excepciones HTTP
✅ Query parameters para filtrado
✅ ParseIntPipe para validación de IDs

