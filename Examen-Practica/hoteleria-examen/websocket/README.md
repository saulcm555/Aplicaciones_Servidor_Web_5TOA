# 🔔 Sistema de Webhooks y WebSocket - Notificaciones en Tiempo Real

## 📋 Descripción

Sistema de notificaciones en tiempo real que implementa un flujo completo:
**REST API** → **Webhook Interno** → **WebSocket Gateway** → **Clientes conectados**

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   REST API      │ (POST/PUT/PATCH en cualquier entidad)
│ (Controllers)   │
└────────┬────────┘
         │ Interceptor captura automáticamente
         ↓
┌─────────────────┐
│    WEBHOOK      │ POST /webhook/notificacion
│  (Intermediario)│
└────────┬────────┘
         │ Aplica lógica adicional
         ↓
┌─────────────────┐
│   WebSocket     │ Emite eventos globales
│    Gateway      │ (sin rooms)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│    Clientes     │ Reciben notificaciones en tiempo real
│   Conectados    │
└─────────────────┘
```

---

## 📦 Componentes

### 1. **WebSocket Gateway** (`websocket.gateway.ts`)
- Puerto: **3001** (separado del REST en 3000)
- Emite eventos **globales** sin usar rooms
- Maneja conexiones/desconexiones de clientes
- Logs detallados de actividad

### 2. **Webhook Controller** (`webhook.controller.ts`)
Endpoints:
- `POST /webhook/notificacion` - Recibe notificaciones del REST
- `GET /webhook/estadisticas` - Estadísticas del servicio
- `GET /webhook/health` - Health check

### 3. **Webhook Service** (`webhook.service.ts`)
- Procesa notificaciones recibidas
- Aplica lógica adicional:
  - Genera mensajes descriptivos
  - Calcula prioridad
  - Categoriza por tipo de entidad
  - Enriquece con metadata
- Envía al WebSocket Gateway

### 4. **Interceptor** (`webhook-notification.interceptor.ts`)
- Captura automáticamente POST/PUT/PATCH en todos los controladores
- Extrae información de la operación
- Envía notificación al webhook de forma asíncrona
- No afecta el flujo normal del REST

### 5. **DTOs** (`dto/webhook-notification.dto.ts`)
```typescript
{
  tipo_operacion: 'create' | 'update' | 'delete' | 'confirmar' | 'cancelar',
  entidad: string,        // 'hoteles', 'reservas', etc.
  id?: number,            // ID del recurso
  datos?: any,            // Datos del recurso
  mensaje?: string        // Mensaje descriptivo
}
```

---

## 🚀 Instalación

### 1. Instalar dependencias adicionales

```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io @nestjs/axios axios
```

### 2. Importar el módulo en `app.module.ts`

```typescript
import { WebhookModule } from './websocket/webhook.module';

@Module({
  imports: [
    // ... otros módulos
    WebhookModule,
  ],
})
export class AppModule {}
```

### 3. (Opcional) Aplicar interceptor globalmente

En `main.ts`:

```typescript
import { HttpModule } from '@nestjs/axios';
import { WebhookNotificationInterceptor } from './websocket/interceptors/webhook-notification.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Aplicar interceptor globalmente
  const httpService = app.get(HttpService);
  app.useGlobalInterceptors(new WebhookNotificationInterceptor(httpService));
  
  // ... resto de configuración
}
```

---

## 🧪 Pruebas con POSTMAN

### **Flujo Completo:**

#### 1. **Conectar cliente WebSocket**

Usar un cliente WebSocket (Socket.io client, navegador, etc.):

```javascript
// En el navegador o aplicación cliente
const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Conectado al servidor WebSocket');
});

socket.on('conexion', (data) => {
  console.log('Mensaje de bienvenida:', data);
});

socket.on('notificacion', (data) => {
  console.log('Nueva notificación recibida:', data);
});
```

**HTML Cliente de prueba:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Cliente WebSocket</title>
  <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
  <h1>Notificaciones en Tiempo Real</h1>
  <div id="notificaciones"></div>

  <script>
    const socket = io('http://localhost:3001');
    const notificacionesDiv = document.getElementById('notificaciones');

    socket.on('notificacion', (data) => {
      const elemento = document.createElement('div');
      elemento.innerHTML = `
        <strong>${data.tipo_operacion}</strong> en 
        <strong>${data.entidad}</strong> #${data.id}
        <br>${data.mensaje}
        <br><small>${data.timestamp}</small>
        <hr>
      `;
      notificacionesDiv.prepend(elemento);
    });
  </script>
</body>
</html>
```

#### 2. **Verificar estadísticas del webhook**

```
GET http://localhost:3000/webhook/estadisticas
```

Respuesta:
```json
{
  "clientesConectados": 1,
  "webhookActivo": true,
  "websocketActivo": true,
  "puerto": 3001
}
```

#### 3. **Crear un hotel (REST API)**

```
POST http://localhost:3000/hoteles
Content-Type: application/json

{
  "nombre": "Hotel Plaza Central",
  "descripcion": "Hotel 5 estrellas en el centro",
  "direccion": "Av. Principal 123",
  "imagen_url": "https://example.com/hotel.jpg",
  "destino_id": 1
}
```

**Flujo automático:**
1. ✅ Hotel se crea en la BD
2. ✅ Interceptor captura el POST
3. ✅ Envía notificación a `POST /webhook/notificacion`
4. ✅ Webhook procesa y enriquece la notificación
5. ✅ WebSocket Gateway emite evento `notificacion`
6. ✅ Todos los clientes conectados reciben:

```json
{
  "tipo_operacion": "create",
  "entidad": "hoteles",
  "id": 1,
  "datos": {
    "id": 1,
    "nombre": "Hotel Plaza Central",
    "descripcion": "Hotel 5 estrellas en el centro",
    "direccion": "Av. Principal 123"
  },
  "mensaje": "Hotel #1 creado exitosamente",
  "metadata": {
    "procesadoEn": "2024-11-24T10:30:00.000Z",
    "prioridad": "media",
    "categoria": "contenido"
  },
  "timestamp": "2024-11-24T10:30:00.500Z",
  "totalClientes": 1
}
```

#### 4. **Enviar notificación manualmente al webhook**

```
POST http://localhost:3000/webhook/notificacion
Content-Type: application/json

{
  "tipo_operacion": "create",
  "entidad": "reservas",
  "id": 5,
  "datos": {
    "cliente_id": 1,
    "habitacion_id": 3,
    "fecha_inicio": "2024-12-01",
    "fecha_fin": "2024-12-05",
    "total": 1200,
    "estado": "pendiente"
  },
  "mensaje": "Nueva reserva creada"
}
```

Respuesta:
```json
{
  "success": true,
  "mensaje": "Notificación procesada y enviada correctamente",
  "notificacion": {
    "tipo_operacion": "create",
    "entidad": "reservas",
    "id": 5,
    "datos": { ... },
    "mensaje": "Nueva reserva creada",
    "metadata": {
      "procesadoEn": "2024-11-24T10:35:00.000Z",
      "prioridad": "alta",
      "categoria": "transacciones"
    }
  },
  "clientesNotificados": 1
}
```

#### 5. **Confirmar una reserva**

```
PATCH http://localhost:3000/reservas/1/confirmar
```

**Notificación automática enviada:**
```json
{
  "tipo_operacion": "confirmar",
  "entidad": "reservas",
  "id": 1,
  "mensaje": "Reserva #1 confirmado",
  "metadata": {
    "prioridad": "alta",
    "categoria": "transacciones"
  }
}
```

---

## 📊 Tipos de Operaciones

| Operación | Trigger | Prioridad |
|-----------|---------|-----------|
| `create` | POST en cualquier entidad | Media |
| `update` | PUT/PATCH en cualquier entidad | Baja |
| `delete` | DELETE en cualquier entidad | Alta |
| `confirmar` | PATCH /reservas/:id/confirmar | Alta |
| `cancelar` | PATCH /reservas/:id/cancelar | Media |

---

## 🎯 Lógica Adicional Aplicada

El webhook aplica la siguiente lógica antes de emitir:

1. **Generación de mensajes descriptivos** si no se proporciona
2. **Cálculo de prioridad:**
   - Alta: Reservas, clientes, eliminaciones
   - Media: Creaciones
   - Baja: Actualizaciones

3. **Categorización por tipo:**
   - `configuracion`: categorias-destinos
   - `contenido`: destinos, hoteles
   - `inventario`: habitaciones
   - `usuarios`: clientes
   - `transacciones`: reservas

4. **Enriquecimiento con metadata:**
   - Timestamp de procesamiento
   - Prioridad calculada
   - Categoría asignada

---

## 🔍 Monitoreo y Debugging

### Ver logs del WebSocket Gateway:
```
[NotificacionesGateway] WebSocket Gateway inicializado en puerto 3001
[NotificacionesGateway] Cliente conectado: abc123
[NotificacionesGateway] Emitiendo evento "notificacion" a 1 clientes
```

### Ver logs del Webhook Service:
```
[WebhookService] Procesando notificación de tipo: create
[WebhookService] Entidad: hoteles, ID: 1
[WebhookService] ✅ Nuevo hoteles creado con ID: 1
```

### Ver logs del Interceptor:
```
[WebhookNotificationInterceptor] Enviando notificación al webhook: create hoteles
[WebhookNotificationInterceptor] Notificación enviada exitosamente al webhook: 201
```

---

## ✅ Características Implementadas

✅ REST no se comunica directamente con WebSocket Gateway
✅ Webhook actúa como intermediario
✅ Lógica adicional aplicada en el webhook
✅ Eventos globales sin rooms
✅ Notificaciones incluyen: tipo, id, operación, datos
✅ Interceptor automático para POST/PUT/PATCH
✅ Logs detallados en cada capa
✅ Manejo robusto de errores
✅ Estadísticas del servicio
✅ Health check endpoint

---

## 🎨 Eventos Emitidos por el WebSocket

| Evento | Cuándo | Datos |
|--------|--------|-------|
| `conexion` | Al conectarse un cliente | Cliente ID, timestamp |
| `notificacion` | Cada operación REST | Notificación completa con metadata |

---

## 🚦 Endpoints Disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/webhook/notificacion` | Recibe notificaciones del REST |
| GET | `/webhook/estadisticas` | Estadísticas del servicio |
| GET | `/webhook/health` | Health check |

---

## 🔧 Configuración

- **Puerto WebSocket:** 3001
- **Puerto REST:** 3000
- **CORS:** Habilitado (*)
- **Timeout Webhook:** 5 segundos
- **Logs:** Habilitados con niveles DEBUG

---

## 📝 Notas Importantes

1. El interceptor **NO** afecta el funcionamiento del REST
2. Si el webhook falla, la operación REST continúa normalmente
3. El WebSocket Gateway funciona independientemente del REST
4. Las notificaciones son **asíncronas** y no bloquean
5. Se pueden conectar **múltiples clientes** simultáneamente
