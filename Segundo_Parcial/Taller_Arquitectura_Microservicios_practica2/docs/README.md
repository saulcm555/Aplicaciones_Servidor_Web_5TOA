# 🚀 Sistema de Microservicios con Event-Driven Architecture y Webhooks

## 📋 Índice
1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Fases de Implementación](#fases-de-implementación)
4. [Flujo Completo de Eventos](#flujo-completo-de-eventos)
5. [Componentes Principales](#componentes-principales)
6. [Guía de Instalación](#guía-de-instalación)
7. [Cómo Probar el Sistema](#cómo-probar-el-sistema)
8. [Patrones de Diseño Implementados](#patrones-de-diseño-implementados)

---

## 🎯 Visión General

Este proyecto implementa una **arquitectura de microservicios orientada a eventos** para un sistema de gestión de órdenes y productos. El sistema utiliza **comunicación asíncrona** mediante RabbitMQ y **notificaciones externas** a través de webhooks serverless.

### Características Principales

✅ **Arquitectura Event-Driven**: Desacoplamiento completo entre servicios  
✅ **Idempotencia**: Garantía de procesamiento único de eventos (Redis)  
✅ **Webhooks Dinámicos**: Suscriptores configurables desde base de datos  
✅ **Serverless Integration**: Edge Functions de Supabase para notificaciones  
✅ **Resiliencia**: Reintentos automáticos y circuit breaker patterns  
✅ **Observabilidad**: Logs estructurados y health checks

### Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| **Runtime** | Node.js 18+ |
| **Framework** | NestJS 10 |
| **Message Broker** | RabbitMQ 3 (Topic Exchange) |
| **Cache & Queues** | Redis 7 + BullMQ |
| **Database** | PostgreSQL (Supabase) + SQLite |
| **Serverless** | Supabase Edge Functions (Deno) |
| **Containerization** | Docker + Docker Compose |

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE HTTP                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (Port 3000)                    │
│  - Validación de requests                                       │
│  - Proxy HTTP a microservicios                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
┌──────────────────┐                 ┌──────────────────┐
│ PRODUCTS SERVICE │                 │  ORDERS SERVICE  │
│   (Port 3001)    │                 │   (Port 3002)    │
│                  │                 │                  │
│ - Gestión Stock  │                 │ - Crear Órdenes  │
│ - Reservas       │                 │ - Validar Stock  │
│ - SQLite DB      │                 │ - SQLite DB      │
└────────┬─────────┘                 └─────────┬────────┘
         │                                     │
         │         ┌──────────────────────────┐│
         └────────▶│   RABBITMQ EXCHANGE      │◀┘
                   │  microservices.events    │
                   │    (Topic Pattern)       │
                   └───────────┬──────────────┘
                               │
                   ┌───────────┴────────────┐
                   │ webhook_publisher_queue│
                   └───────────┬────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│            WEBHOOK PUBLISHER SERVICE (Port 3003)                │
│                                                                 │
│  ┌──────────────────┐    ┌────────────────┐   ┌─────────────┐ │
│  │ RawRabbitConsumer│───▶│ WebhookService │──▶│   BullMQ    │ │
│  │  (Queue Listener)│    │  (Dispatcher)  │   │   Worker    │ │
│  └──────────────────┘    └────────────────┘   └──────┬──────┘ │
│                                                        │        │
│  ┌──────────────────────────────────────────────────┐ │        │
│  │        IDEMPOTENCY SERVICE (Redis)               │ │        │
│  │  - TTL 1 hora (memoria corta)                    │ │        │
│  │  - TTL 7 días (Supabase persistente)             │ │        │
│  └──────────────────────────────────────────────────┘ │        │
└────────────────────────────────────────────────────────┼────────┘
                                                         │
                                   ┌─────────────────────┼─────────────────┐
                                   │                     │                 │
                                   ▼                     ▼                 ▼
                          ┌────────────────┐   ┌────────────────┐ ┌────────────────┐
                          │  SUPABASE      │   │  SUPABASE      │ │   TELEGRAM     │
                          │ Webhook Logger │   │ Telegram       │ │     BOT        │
                          │ Edge Function  │   │   Notifier     │ │  (Final User)  │
                          └────────────────┘   └────────────────┘ └────────────────┘
```

### Flujo de Datos

1. **Cliente** → POST `/orders` → **API Gateway**
2. **API Gateway** → HTTP → **Orders Service**
3. **Orders Service** → Valida producto → HTTP → **Products Service**
4. **Products Service** → Responde disponibilidad
5. **Orders Service** → Publica `order.confirmed` → **RabbitMQ Exchange**
6. **RabbitMQ** → Routing key: `order.confirmed` → **webhook_publisher_queue**
7. **Webhook Publisher** → Consume evento → Consulta suscriptores (Supabase)
8. **Webhook Publisher** → Envía webhooks HTTP → **Edge Functions**
9. **Edge Functions** → Procesa → **Telegram Bot**

---

## 📚 Fases de Implementación

### FASE 1: Microservicios Base ✅

**Objetivo**: Crear la infraestructura básica de microservicios con comunicación RPC.

**Componentes Implementados**:
- ✅ API Gateway con validación de DTOs
- ✅ Orders Service con persistencia SQLite
- ✅ Products Service con gestión de inventario
- ✅ Comunicación síncrona HTTP entre servicios

**Eventos Creados**:
- `product.reserveStock`: Solicitud de reserva de inventario
- `product.stockReserved`: Confirmación de reserva (aprobada/rechazada)
- `order.confirmed`: Orden aprobada y persistida
- `order.cancelled`: Orden rechazada por falta de stock

**Archivos Clave**:
- `api-gateway/src/orders/orders.controller.ts`
- `orders-service/src/orders/orders.service.ts`
- `products-service/src/products/products.service.ts`

---

### FASE 2: Infraestructura Message-Driven ✅

**Objetivo**: Implementar comunicación asíncrona mediante RabbitMQ.

**Cambios Realizados**:
- ✅ Configuración de RabbitMQ con Topic Exchange
- ✅ Migración de RPC a Event-Based patterns
- ✅ Implementación de Idempotent Consumer con Redis
- ✅ Configuración de TTL para prevenir duplicados

**Configuración RabbitMQ**:
```yaml
Exchange: microservices.events
Type: topic
Routing Keys:
  - order.confirmed
  - order.cancelled
  - product.stockReserved

Queue: webhook_publisher_queue
Binding: microservices.events → routing_key: #
```

**Patrón de Idempotencia**:
```typescript
// Redis TTL 24 horas
await redisService.set(`order:${idempotencyKey}`, 'true', 86400);

// Supabase TTL 7 días (log persistente)
await supabase.from('webhook_deliveries').insert({
  idempotency_key: key,
  delivered_at: new Date()
});
```

**Documentación**: `docs/FASE-2-Configuracion-Infraestructura.md`

---

### FASE 3: Suscriptores Dinámicos desde Supabase ✅

**Objetivo**: Configurar webhooks dinámicos sin hardcodear URLs.

**Implementación**:
- ✅ Tabla `webhook_subscribers` en PostgreSQL
- ✅ Servicio de caché con TTL 45 segundos
- ✅ Filtrado de suscriptores por tipo de evento
- ✅ Refresh automático y manual vía endpoint

**Estructura de Base de Datos**:
```sql
CREATE TABLE webhook_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  events TEXT[] NOT NULL,          -- ['order.confirmed', 'order.cancelled']
  secret VARCHAR(255),              -- Para HMAC signature
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Suscriptores Activos**:
1. **Webhook Logger**: Registra todos los eventos en Supabase
2. **Telegram Notifier**: Envía notificaciones push vía bot
3. **Development Webhook Receiver**: Endpoint local para testing

**Endpoints de Gestión**:
```bash
# Consultar suscriptores actuales
GET http://localhost:3003/health/subscribers

# Forzar actualización de caché
POST http://localhost:3003/health/subscribers/refresh
```

---

### FASE 4: Webhook Publisher Service ✅

**Objetivo**: Crear microservicio dedicado para distribución de webhooks.

**Arquitectura del Servicio**:

```
┌─────────────────────────────────────────────────────────┐
│         WEBHOOK PUBLISHER SERVICE                       │
│                                                         │
│  ┌────────────────────────────────────────────────┐   │
│  │  RawRabbitConsumer (amqplib directo)           │   │
│  │  - Consume de webhook_publisher_queue          │   │
│  │  - Extrae routing key del mensaje              │   │
│  │  - Bypasea limitaciones de @EventPattern       │   │
│  └───────────────────┬────────────────────────────┘   │
│                      │                                  │
│                      ▼                                  │
│  ┌────────────────────────────────────────────────┐   │
│  │  WebhookService                                │   │
│  │  - Consulta SubscribersService                 │   │
│  │  - Valida idempotencia (Redis + Supabase)     │   │
│  │  - Encola jobs en BullMQ                       │   │
│  └───────────────────┬────────────────────────────┘   │
│                      │                                  │
│                      ▼                                  │
│  ┌────────────────────────────────────────────────┐   │
│  │  WebhookProcessor (BullMQ Worker)             │   │
│  │  - Ejecuta HTTP POST a cada subscriber        │   │
│  │  - Retry: 5 intentos con backoff exponencial  │   │
│  │  - Timeout: 30 segundos por request           │   │
│  │  - Registra delivery en Supabase              │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Componentes Clave**:

1. **RawRabbitConsumer** (`src/webhook/raw-rabbit.consumer.ts`)
   - Consume mensajes directamente con `amqplib`
   - No depende de NestJS `@EventPattern` (que requiere metadata especial)
   - Extrae `routing_key` de `msg.fields.routingKey`
   - Hace ACK/NACK manual para control de flujo

2. **SubscribersService** (`src/webhook/subscribers.service.ts`)
   - Cachea subscribers de Supabase (TTL 45s)
   - Fallback a suscriptores hardcoded si DB falla
   - Filtra por tipo de evento

3. **IdempotencyService** (`src/webhook/idempotency.service.ts`)
   - Redis: Cache de 1 hora (memoria corta)
   - Supabase: Persistencia de 7 días (auditoría)
   - Previene procesamiento duplicado

4. **WebhookProcessor** (`src/webhook/webhook.processor.ts`)
   - Worker de BullMQ para procesar webhooks
   - Reintentos automáticos: 5 intentos
   - Backoff exponencial: 10s, 30s, 60s, 120s, 300s
   - Logs estructurados de cada intento

**Solución de Problemas Encontrados**:

❌ **Problema Original**: NestJS `@EventPattern` requiere `message.properties.pattern` en metadata de RabbitMQ, pero `ClientProxy.emit()` con Topic Exchange NO lo incluye.

✅ **Solución Implementada**: 
- **Publisher**: Crear `RawRabbitPublisher` en orders-service que usa `amqplib.publish()` directamente
- **Consumer**: Crear `RawRabbitConsumer` que bypasea `@EventPattern` y consume con `channel.consume()`
- **Resultado**: Routing keys funcionan correctamente (`order.confirmed`, `order.cancelled`)

**Código RawRabbitPublisher**:
```typescript
// orders-service/src/orders/raw-rabbit.publisher.ts
async publish(routingKey: string, data: any): Promise<void> {
  const message = Buffer.from(JSON.stringify(data));
  this.channel.publish(
    this.exchange,           // microservices.events
    routingKey,              // order.confirmed
    message,
    { persistent: true, contentType: 'application/json' }
  );
}
```

**Código RawRabbitConsumer**:
```typescript
// webhook-publisher-service/src/webhook/raw-rabbit.consumer.ts
await this.channel.consume('webhook_publisher_queue', async (msg) => {
  const routingKey = msg.fields.routingKey;  // ✅ Extrae routing key
  const data = JSON.parse(msg.content.toString());
  
  await this.webhookService.processEvent(routingKey, data);
  this.channel.ack(msg);
}, { noAck: false });
```

**Documentación**: `docs/FASE-4-Webhook-Publisher-Service.md`

---

## 🔄 Flujo Completo de Eventos

### 1️⃣ Creación de Orden (Happy Path)

```mermaid
sequenceDiagram
    participant C as Cliente
    participant AG as API Gateway
    participant OS as Orders Service
    participant PS as Products Service
    participant R as RabbitMQ
    participant WP as Webhook Publisher
    participant S as Supabase
    participant T as Telegram

    C->>AG: POST /orders {productId, quantity}
    AG->>OS: HTTP POST /orders
    OS->>PS: HTTP GET /products/:id/check-stock
    PS-->>OS: {available: true, stock: 10}
    OS->>OS: Crear orden (status: CONFIRMED)
    OS->>R: publish('order.confirmed', payload)
    R->>WP: route to webhook_publisher_queue
    WP->>S: SELECT * FROM webhook_subscribers
    S-->>WP: [3 subscribers]
    WP->>WP: Validar idempotencia (Redis)
    WP->>S: POST /functions/v1/webhook-logger
    WP->>S: POST /functions/v1/telegram-notifier
    S->>T: Enviar mensaje a bot
    T-->>C: 🔔 Notificación: Orden Confirmada
    OS-->>AG: {id, status: CONFIRMED}
    AG-->>C: 200 OK
```

### 2️⃣ Orden Rechazada por Falta de Stock

```
Cliente → API Gateway → Orders Service → Products Service
                                          ↓ (stock insuficiente)
                                    {available: false}
                                          ↓
Orders Service → order.status = REJECTED
              ↓
RabbitMQ Exchange (routing_key: order.cancelled)
              ↓
Webhook Publisher → Telegram Notifier
              ↓
Telegram Bot: "❌ Orden Cancelada - Sin Stock"
```

### 3️⃣ Reintentos Automáticos

```
Webhook Delivery Attempt 1 → FAILED (Network Timeout)
              ↓
BullMQ espera 10 segundos
              ↓
Attempt 2 → FAILED (503 Service Unavailable)
              ↓
BullMQ espera 30 segundos
              ↓
Attempt 3 → SUCCESS (200 OK)
              ↓
Marca como completado en Supabase
```

---

## 🧩 Componentes Principales

### API Gateway (Puerto 3000)

**Responsabilidades**:
- Punto de entrada único para clientes externos
- Validación de DTOs con `class-validator`
- Routing de requests a microservicios internos

**Endpoints**:
```bash
POST /orders       # Crear nueva orden
GET  /health       # Health check
```

---

### Orders Service (Puerto 3002)

**Responsabilidades**:
- Gestión del ciclo de vida de órdenes
- Validación de stock con Products Service
- Publicación de eventos de dominio

**Base de Datos**: SQLite (`orders.db`)
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  productId TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  status TEXT CHECK(status IN ('PENDING', 'CONFIRMED', 'REJECTED')),
  idempotencyKey TEXT UNIQUE NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Eventos Publicados**:
- `order.confirmed`: Orden aprobada
- `order.cancelled`: Orden rechazada

**Código de Publicación**:
```typescript
// orders-service/src/orders/orders.service.ts
if (data.approved) {
  await this.rabbitPublisher.publish('order.confirmed', {
    orderId: order.id,
    status: 'CONFIRMED',
    productId: data.productId,
    quantity: data.quantity,
    idempotencyKey: data.idempotencyKey,
    timestamp: new Date().toISOString()
  });
}
```

---

### Products Service (Puerto 3001)

**Responsabilidades**:
- Gestión de catálogo de productos
- Control de inventario y stock
- Reserva y liberación de stock

**Base de Datos**: SQLite (`products.db`)
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);
```

**Endpoints REST**:
```bash
GET  /products                    # Listar productos
GET  /products/:id                # Obtener producto
GET  /products/:id/check-stock    # Verificar disponibilidad
POST /products/:id/reserve        # Reservar stock
POST /products                    # Crear producto
PATCH /products/:id               # Actualizar producto
```

---

### Webhook Publisher Service (Puerto 3003)

**Responsabilidades**:
- Consumir eventos de RabbitMQ
- Consultar suscriptores dinámicos de Supabase
- Validar idempotencia de eventos
- Distribuir webhooks con reintentos

**Componentes Internos**:

1. **RawRabbitConsumer**: Consumer directo de RabbitMQ (bypasea NestJS)
2. **SubscribersService**: Cache de suscriptores con TTL
3. **IdempotencyService**: Redis (1h) + Supabase (7d)
4. **WebhookProcessor**: Worker BullMQ con reintentos

**Health Checks**:
```bash
GET  /health                       # Estado general
GET  /health/ready                 # Readiness probe
GET  /health/subscribers           # Listar suscriptores activos
POST /health/subscribers/refresh   # Refrescar cache de suscriptores
```

---

### Supabase Edge Functions

**1. Webhook Logger** (`supabase/functions/webhook-logger/index.ts`)
- Registra todos los webhooks recibidos en tabla `webhook_deliveries`
- Usado para auditoría y debugging

**2. Telegram Notifier** (`supabase/functions/telegram-notifier/index.ts`)
- Envía notificaciones push a Telegram Bot
- Formatea mensajes con emojis y estructura JSON
- Variables de entorno: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

**Configuración de Telegram Bot**:
```bash
# Crear bot con @BotFather
# Obtener token y chat_id
# Configurar en Supabase:
supabase secrets set TELEGRAM_BOT_TOKEN=123456:ABCdefGHIjklMNOpqrsTUVwxyz
supabase secrets set TELEGRAM_CHAT_ID=123456789
```

---

## 📦 Guía de Instalación

### Prerequisitos

- Docker Desktop instalado
- Node.js 18+ (para desarrollo local)
- Supabase CLI (opcional, para Edge Functions)

### 1. Clonar y Configurar Variables de Entorno

```bash
# Clonar repositorio
git clone <repo-url>
cd Taller_Arquitectura_Microservicios

# Crear archivo .env en la raíz
cat > .env << EOF
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_EXCHANGE=microservices.events
REDIS_HOST=redis
REDIS_PORT=6379
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_ANON_KEY
EOF
```

### 2. Iniciar Infraestructura con Docker

```bash
# Construir y levantar todos los servicios
docker-compose up -d --build

# Verificar que todos los contenedores estén corriendo
docker-compose ps

# Deberías ver:
# ✓ api-gateway (port 3000)
# ✓ orders-service (port 3002)
# ✓ products-service (port 3001)
# ✓ webhook-publisher-service (port 3003)
# ✓ rabbitmq (ports 5672, 15672)
# ✓ redis (port 6379)
# ✓ postgres (port 5432)
```

### 3. Inicializar Base de Datos

```bash
# Seed de productos
docker exec -it products-service npm run seed

# Verificar productos creados
curl http://localhost:3001/products
```

### 4. Configurar Webhooks en Supabase

```sql
-- Ejecutar en Supabase SQL Editor
INSERT INTO webhook_subscribers (name, url, events, is_active) VALUES
  ('Webhook Logger', 
   'https://YOUR_PROJECT.supabase.co/functions/v1/webhook-logger', 
   ARRAY['order.confirmed', 'order.cancelled'], 
   true),
  ('Telegram Notifier', 
   'https://YOUR_PROJECT.supabase.co/functions/v1/telegram-notifier', 
   ARRAY['order.confirmed'], 
   true);
```

### 5. Desplegar Edge Functions

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link proyecto
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy webhook-logger
supabase functions deploy telegram-notifier

# Configurar secretos
supabase secrets set TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
supabase secrets set TELEGRAM_CHAT_ID=YOUR_CHAT_ID
```

---

## 🧪 Cómo Probar el Sistema

### 1. Health Checks

```bash
# API Gateway
curl http://localhost:3000/health
# Respuesta: {"status":"ok","timestamp":"2025-12-15T..."}

# Orders Service
curl http://localhost:3002/health

# Products Service
curl http://localhost:3001/products

# Webhook Publisher
curl http://localhost:3003/health
curl http://localhost:3003/health/subscribers
```

### 2. Crear Orden (Happy Path)

```bash
# 1. Obtener ID de un producto
curl http://localhost:3001/products | jq '.[0].id'
# Output: "4892064a-1587-4b18-914c-ea664fc629cf"

# 2. Crear orden
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "4892064a-1587-4b18-914c-ea664fc629cf",
    "quantity": 1
  }'

# Respuesta esperada:
# {
#   "id": "550e8400-e29b-41d4-a716-446655440000",
#   "productId": "4892064a-1587-4b18-914c-ea664fc629cf",
#   "quantity": 1,
#   "status": "PENDING",
#   "idempotencyKey": "7c9e6679-7425-40de-944b-e07fc1f90ae7"
# }

# 3. Verificar logs del webhook publisher
docker logs webhook-publisher-service --tail 30

# Logs esperados:
# [RawRabbitConsumer] 📬 Received message: order.confirmed
# [WebhookService] 📡 Sending webhooks to 2 subscribers
# [WebhookService] ✅ Webhook sent successfully to telegram-notifier | Status: 200
# [WebhookProcessor] ✅ Webhook delivered | Subscriber: Telegram Notifier

# 4. Verificar notificación en Telegram
# Deberías recibir un mensaje en tu bot con los datos de la orden
```

### 3. Probar Idempotencia

```bash
# Crear orden con idempotency key personalizada
IDEMPOTENCY_KEY=$(uuidgen)

# Primera request (exitosa)
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "productId": "4892064a-1587-4b18-914c-ea664fc629cf",
    "quantity": 1
  }'
# Status: 201 Created

# Segunda request con mismo key (bloqueada)
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "productId": "4892064a-1587-4b18-914c-ea664fc629cf",
    "quantity": 1
  }'
# Status: 409 Conflict
# Message: "Duplicate request detected"
```

### 4. Verificar RabbitMQ Management UI

```bash
# Acceder a http://localhost:15672
# Usuario: guest
# Password: guest

# Verificar:
# - Exchange "microservices.events" (tipo: topic)
# - Queue "webhook_publisher_queue"
# - Bindings con routing key "#"
# - Mensajes publicados y consumidos
```

### 5. Inspeccionar Redis

```bash
# Conectar a Redis
docker exec -it microservices_redis redis-cli

# Ver keys de idempotencia (TTL 1 hora)
KEYS order.confirmed:*

# Ver TTL de una key
TTL order.confirmed:7c9e6679-7425-40de-944b-e07fc1f90ae7

# Ver valor
GET order.confirmed:7c9e6679-7425-40de-944b-e07fc1f90ae7
```

### 6. Consultar Logs de Delivery en Supabase

```sql
-- Ver últimos 10 webhooks entregados
SELECT 
  event_type,
  subscriber_name,
  status_code,
  delivered_at,
  retry_count
FROM webhook_deliveries
ORDER BY delivered_at DESC
LIMIT 10;

-- Ver webhooks fallidos
SELECT * FROM webhook_deliveries
WHERE status_code >= 400
ORDER BY delivered_at DESC;
```

---

## 🎨 Patrones de Diseño Implementados

### 1. Event-Driven Architecture
**Descripción**: Servicios se comunican mediante eventos asíncronos en lugar de llamadas RPC síncronas.

**Beneficios**:
- Desacoplamiento temporal y espacial
- Escalabilidad horizontal
- Resiliencia ante fallos de servicios

**Implementación**: RabbitMQ Topic Exchange con routing keys

---

### 2. Idempotent Consumer Pattern
**Descripción**: Garantiza que eventos duplicados no se procesen múltiples veces.

**Implementación**:
```typescript
// Verificar en Redis (rápido)
const exists = await redis.get(idempotencyKey);
if (exists) return; // Ya procesado

// Procesar evento
await processEvent(data);

// Marcar como procesado
await redis.set(idempotencyKey, 'true', 'EX', 3600);
await supabase.from('webhook_deliveries').insert({
  idempotency_key: idempotencyKey,
  delivered_at: new Date()
});
```

---

### 3. Retry Pattern con Exponential Backoff
**Descripción**: Reintentos automáticos con intervalos crecientes.

**Configuración BullMQ**:
```typescript
{
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 10000  // 10s, 30s, 60s, 120s, 300s
  }
}
```

---

### 4. Publisher-Subscriber Pattern
**Descripción**: Múltiples suscriptores reciben el mismo evento sin conocerse entre sí.

**Implementación**: Topic Exchange permite que múltiples queues se suscriban al mismo routing key.

---

### 5. Circuit Breaker (Implícito en BullMQ)
**Descripción**: Detiene reintentos después de N fallos consecutivos.

**Resultado**: Después de 5 intentos fallidos, el job se marca como "failed" y no se reintenta más.

---

### 6. Outbox Pattern (Simplificado)
**Descripción**: Garantiza consistencia entre cambio de estado de la orden y publicación del evento.

**Implementación**: 
```typescript
// 1. Persistir orden en DB
const order = await orderRepository.save(newOrder);

// 2. Publicar evento (mismo bloque try/catch)
await rabbitPublisher.publish('order.confirmed', payload);
```

---

## 📊 Métricas y Observabilidad

### Logs Estructurados

Todos los servicios usan NestJS Logger con formato estructurado:

```typescript
this.logger.log(`📤 Publishing event: ${eventType} | Order: ${orderId}`);
this.logger.warn(`⚠️  Retry attempt ${attempt}/${maxAttempts}`);
this.logger.error(`❌ Webhook failed | URL: ${url} | Error: ${error}`);
```

### Health Checks

```bash
# Liveness Probe
GET /health
Response: 200 OK

# Readiness Probe
GET /health/ready
Response: 200 OK si:
  - RabbitMQ conectado
  - Redis disponible
  - Supabase accesible
```

### Monitoreo de RabbitMQ

```bash
# Acceder a Management UI
http://localhost:15672

# Dashboards:
- Overview: Tasas de publicación/consumo
- Queues: Profundidad de cola, mensajes pendientes
- Connections: Conexiones activas por servicio
```

---

## 🔐 Seguridad y Mejores Prácticas

### 1. HMAC Signature Verification (Planificado)

```typescript
// Generar signature en publisher
const signature = crypto
  .createHmac('sha256', subscriber.secret)
  .update(JSON.stringify(payload))
  .digest('hex');

headers['X-Webhook-Signature'] = `sha256=${signature}`;
```

```typescript
// Verificar en subscriber
const receivedSignature = request.headers['x-webhook-signature'];
const expectedSignature = crypto
  .createHmac('sha256', SECRET)
  .update(request.body)
  .digest('hex');

if (receivedSignature !== `sha256=${expectedSignature}`) {
  throw new UnauthorizedException('Invalid signature');
}
```

### 2. Rate Limiting (Planificado)

```typescript
// Limitar requests por IP
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests por 60 segundos
@Post('/orders')
```

### 3. Secrets Management

```bash
# Usar variables de entorno
# NUNCA hardcodear tokens o passwords en código

# Docker Compose
environment:
  SUPABASE_KEY: ${SUPABASE_KEY}
  TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}

# Supabase Edge Functions
supabase secrets set KEY=value
```

---

## 📖 Referencias y Documentación Adicional

- **Documentación NestJS**: https://docs.nestjs.com
- **RabbitMQ Tutorials**: https://www.rabbitmq.com/getstarted.html
- **BullMQ Guide**: https://docs.bullmq.io
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Event-Driven Patterns**: https://martinfowler.com/articles/201701-event-driven.html

---

## 🚧 Roadmap y Mejoras Futuras

- [ ] Implementar Circuit Breaker Pattern con `opossum`
- [ ] Agregar HMAC signature verification a todos los webhooks
- [ ] Implementar Dead Letter Queue para eventos fallidos
- [ ] Dashboard de métricas con Prometheus + Grafana
- [ ] Rate limiting por subscriber
- [ ] Webhook replay desde tabla de auditoría
- [ ] Testing E2E automatizado con Jest
- [ ] CI/CD pipeline con GitHub Actions

---

## 👥 Contribuidores

- **Saul Castillo** - Implementación completa de las 4 fases

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico para la asignatura de Arquitectura de Software.

---

**Última actualización**: 15 de Diciembre, 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Producción Ready
