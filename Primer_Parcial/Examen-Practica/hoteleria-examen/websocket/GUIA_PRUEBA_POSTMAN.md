# 🧪 Guía de Prueba con POSTMAN - Sistema de Webhooks y WebSocket

## 📋 Pre-requisitos

1. ✅ Instalar dependencias adicionales:
```bash
npm install @nestjs/websockets @nestjs/platform-socket.io socket.io @nestjs/axios axios
```

2. ✅ Iniciar el servidor:
```bash
npm run start:dev
```

3. ✅ Abrir el cliente WebSocket en el navegador:
- Navegar a: `websocket/cliente-websocket.html`
- O usar cualquier cliente Socket.io

---

## 🔄 FLUJO COMPLETO DE PRUEBA

### **PASO 1: Verificar que el servicio está activo**

#### 1.1 Health Check del Webhook
```
GET http://localhost:3000/webhook/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "servicio": "webhook",
  "timestamp": "2024-11-24T10:00:00.000Z",
  "mensaje": "Servicio webhook funcionando correctamente"
}
```

#### 1.2 Ver Estadísticas del Webhook
```
GET http://localhost:3000/webhook/estadisticas
```

**Respuesta esperada:**
```json
{
  "clientesConectados": 1,
  "webhookActivo": true,
  "websocketActivo": true,
  "puerto": 3001
}
```

---

### **PASO 2: Conectar Cliente WebSocket**

Abrir `websocket/cliente-websocket.html` en el navegador.

Deberías ver:
- ✅ Estado: "Conectado"
- ✅ Cliente ID asignado
- ✅ Total de clientes conectados: 1

**Consola del navegador:**
```
✅ Conectado al servidor WebSocket
📨 Mensaje de bienvenida: {mensaje: "Conectado al servidor de notificaciones", ...}
```

**Consola del servidor:**
```
[NotificacionesGateway] Cliente conectado: abc123
[NotificacionesGateway] Total de clientes conectados: 1
```

---

### **PASO 3: Prueba Manual del Webhook**

Enviar una notificación directamente al webhook para probar el flujo:

```
POST http://localhost:3000/webhook/notificacion
Content-Type: application/json

{
  "tipo_operacion": "create",
  "entidad": "test",
  "id": 999,
  "datos": {
    "mensaje": "Prueba manual del webhook"
  },
  "mensaje": "Notificación de prueba enviada exitosamente"
}
```

**Respuesta del webhook:**
```json
{
  "success": true,
  "mensaje": "Notificación procesada y enviada correctamente",
  "notificacion": {
    "tipo_operacion": "create",
    "entidad": "test",
    "id": 999,
    "datos": {
      "mensaje": "Prueba manual del webhook"
    },
    "mensaje": "Notificación de prueba enviada exitosamente",
    "metadata": {
      "procesadoEn": "2024-11-24T10:05:00.000Z",
      "prioridad": "baja",
      "categoria": "general"
    }
  },
  "clientesNotificados": 1
}
```

**En el cliente WebSocket (navegador):**
Aparecerá una nueva notificación con:
- Badge verde "CREATE"
- Mensaje: "Notificación de prueba enviada exitosamente"
- Detalles de la operación

---

### **PASO 4: Flujo Automático - Crear Categoría**

Ahora probaremos el flujo completo automático con el interceptor.

#### 4.1 Crear Categoría de Destino
```
POST http://localhost:3000/categorias-destinos
Content-Type: application/json

{
  "nombre": "Aventura Extrema",
  "descripcion": "Destinos para deportes de aventura y actividades extremas"
}
```

**Respuesta REST (normal):**
```json
{
  "id": 1,
  "nombre": "Aventura Extrema",
  "descripcion": "Destinos para deportes de aventura y actividades extremas"
}
```

**🔔 Notificación automática en el cliente WebSocket:**
```json
{
  "tipo_operacion": "create",
  "entidad": "categorias-destinos",
  "id": 1,
  "datos": {
    "id": 1,
    "nombre": "Aventura Extrema",
    "descripcion": "Destinos para deportes de aventura y actividades extremas"
  },
  "mensaje": "Categoría de Destino #1 creado exitosamente",
  "metadata": {
    "procesadoEn": "2024-11-24T10:10:00.000Z",
    "prioridad": "baja",
    "categoria": "configuracion"
  },
  "timestamp": "2024-11-24T10:10:00.500Z",
  "totalClientes": 1
}
```

---

### **PASO 5: Flujo Completo - Crear Destino**

```
POST http://localhost:3000/destinos
Content-Type: application/json

{
  "nombre": "Paracas",
  "descripcion": "Reserva natural con playas y fauna marina",
  "imagen_url": "https://example.com/paracas.jpg",
  "categoria_id": 1
}
```

**🔔 Notificación automática:**
- Badge verde "CREATE"
- Prioridad: MEDIA
- Categoría: contenido
- Mensaje: "Destino #1 creado exitosamente"

---

### **PASO 6: Flujo Completo - Crear Hotel**

```
POST http://localhost:3000/hoteles
Content-Type: application/json

{
  "nombre": "Hotel Paracas Luxury Collection",
  "descripcion": "Resort 5 estrellas frente al mar",
  "direccion": "Av. Paracas 173",
  "imagen_url": "https://example.com/hotel-paracas.jpg",
  "destino_id": 1
}
```

**🔔 Notificación automática:**
- Badge verde "CREATE"
- Prioridad: MEDIA
- Categoría: contenido
- Mensaje: "Hotel #1 creado exitosamente"

---

### **PASO 7: Flujo Completo - Crear Habitación**

```
POST http://localhost:3000/habitaciones
Content-Type: application/json

{
  "hotel_id": 1,
  "categoria": "Suite Ocean View",
  "precio": 450.00,
  "capacidad": 2,
  "descripcion": "Suite con vista al mar, cama king size",
  "imagen_url": "https://example.com/suite.jpg",
  "wifi": true,
  "tv": true,
  "aire_acondicionado": true,
  "minibar": true,
  "desayuno_incluido": true
}
```

**🔔 Notificación automática:**
- Badge verde "CREATE"
- Prioridad: BAJA
- Categoría: inventario
- Mensaje: "Habitación #1 creado exitosamente"

---

### **PASO 8: Flujo Completo - Crear Cliente**

```
POST http://localhost:3000/clientes
Content-Type: application/json

{
  "nombre": "Ana",
  "apellido": "Martínez",
  "email": "ana.martinez@email.com",
  "telefono": "+51 987654321",
  "foto_url": "https://example.com/ana.jpg"
}
```

**🔔 Notificación automática:**
- Badge verde "CREATE"
- Prioridad: ALTA (los clientes son prioridad alta)
- Categoría: usuarios
- Mensaje: "Cliente #1 creado exitosamente"

---

### **PASO 9: Flujo Completo - Crear Reserva**

```
POST http://localhost:3000/reservas
Content-Type: application/json

{
  "cliente_id": 1,
  "habitacion_id": 1,
  "fecha_inicio": "2024-12-15",
  "fecha_fin": "2024-12-20",
  "total": 2250.00,
  "estado": "pendiente"
}
```

**🔔 Notificación automática:**
- Badge verde "CREATE"
- Prioridad: ALTA (las reservas son prioridad alta)
- Categoría: transacciones
- Mensaje: "Reserva #1 creado exitosamente"

---

### **PASO 10: Operaciones de Actualización**

#### 10.1 Actualizar Hotel
```
PATCH http://localhost:3000/hoteles/1
Content-Type: application/json

{
  "descripcion": "Resort 5 estrellas frente al mar - Renovado en 2024"
}
```

**🔔 Notificación automática:**
- Badge naranja "UPDATE"
- Prioridad: BAJA
- Mensaje: "Hotel #1 actualizado"

#### 10.2 Actualizar Cliente
```
PATCH http://localhost:3000/clientes/1
Content-Type: application/json

{
  "telefono": "+51 999888777"
}
```

**🔔 Notificación automática:**
- Badge naranja "UPDATE"
- Prioridad: BAJA (pero entidad clientes es importante)
- Categoría: usuarios

---

### **PASO 11: Operaciones Especiales - Confirmar Reserva**

```
PATCH http://localhost:3000/reservas/1/confirmar
```

**Respuesta:**
```json
{
  "id": 1,
  "cliente_id": 1,
  "habitacion_id": 1,
  "fecha_inicio": "2024-12-15",
  "fecha_fin": "2024-12-20",
  "total": 2250.00,
  "estado": "confirmada"
}
```

**🔔 Notificación automática:**
- Badge azul "CONFIRMAR"
- Prioridad: ALTA
- Categoría: transacciones
- Mensaje: "Reserva #1 confirmado"

**Logs del servidor:**
```
[WebhookService] ✅ Reserva con ID 1 confirmada
```

---

### **PASO 12: Operaciones Especiales - Cancelar Reserva**

```
PATCH http://localhost:3000/reservas/1/cancelar
```

**🔔 Notificación automática:**
- Badge púrpura "CANCELAR"
- Prioridad: MEDIA
- Categoría: transacciones
- Mensaje: "Reserva #1 cancelado"

**Logs del servidor:**
```
[WebhookService] ❌ Reserva con ID 1 cancelada
```

---

### **PASO 13: Crear múltiples entidades rápidamente**

Para ver múltiples notificaciones en tiempo real:

#### 13.1 Crear varias categorías
```
POST http://localhost:3000/categorias-destinos
{"nombre": "Relax & Spa", "descripcion": "Destinos para relajación"}
```

```
POST http://localhost:3000/categorias-destinos
{"nombre": "Gastronomía", "descripcion": "Destinos gastronómicos"}
```

```
POST http://localhost:3000/categorias-destinos
{"nombre": "Cultural", "descripcion": "Destinos culturales e históricos"}
```

#### 13.2 Crear varios destinos
```
POST http://localhost:3000/destinos
{"nombre": "Cusco", "descripcion": "Ciudad imperial", "categoria_id": 4}
```

```
POST http://localhost:3000/destinos
{"nombre": "Arequipa", "descripcion": "Ciudad blanca", "categoria_id": 4}
```

**Resultado en el cliente WebSocket:**
- Verás las notificaciones aparecer una tras otra
- Contador de notificaciones aumentando
- Cada una con su badge de color y prioridad

---

## 🎯 Verificaciones Importantes

### ✅ Checklist de Funcionamiento

1. **WebSocket Gateway:**
   - [ ] Puerto 3001 abierto
   - [ ] Clientes pueden conectarse
   - [ ] Logs muestran conexiones/desconexiones
   - [ ] Eventos se emiten correctamente

2. **Webhook Endpoint:**
   - [ ] `POST /webhook/notificacion` responde
   - [ ] `GET /webhook/estadisticas` funciona
   - [ ] `GET /webhook/health` retorna OK

3. **Interceptor:**
   - [ ] Captura POST automáticamente
   - [ ] Captura PUT/PATCH automáticamente
   - [ ] No captura GET ni DELETE
   - [ ] No causa recursión en /webhook

4. **Cliente WebSocket:**
   - [ ] Se conecta automáticamente
   - [ ] Muestra estado de conexión
   - [ ] Recibe notificaciones
   - [ ] Muestra estadísticas actualizadas

5. **Logs del Servidor:**
   ```
   [NotificacionesGateway] WebSocket Gateway inicializado
   [NotificacionesGateway] Cliente conectado: abc123
   [WebhookNotificationInterceptor] Enviando notificación al webhook
   [WebhookService] Procesando notificación de tipo: create
   [NotificacionesGateway] Emitiendo evento "notificacion" a 1 clientes
   ```

---

## 🔍 Debugging

### Ver todos los logs del servidor:
```bash
npm run start:dev
```

### Si no recibes notificaciones:

1. **Verificar que el cliente WebSocket está conectado:**
   - Abrir consola del navegador
   - Buscar mensaje: "✅ Conectado al servidor WebSocket"

2. **Verificar estadísticas:**
   ```
   GET http://localhost:3000/webhook/estadisticas
   ```
   Debe mostrar `clientesConectados: 1` o más

3. **Verificar que el interceptor está activo:**
   - Buscar en logs del servidor al iniciar:
   ```
   ✅ Interceptor de Webhooks activado globalmente
   ```

4. **Probar webhook manualmente:**
   ```
   POST http://localhost:3000/webhook/notificacion
   {"tipo_operacion": "create", "entidad": "test", "id": 1}
   ```

---

## 📊 Resultados Esperados

Después de ejecutar todos los pasos, deberías tener:

- ✅ **15-20 notificaciones** en el cliente WebSocket
- ✅ **1+ clientes conectados**
- ✅ **Logs detallados** en el servidor
- ✅ **Todas las operaciones REST** funcionando normalmente
- ✅ **Notificaciones en tiempo real** sin retrasos

---

## 🎨 Colores de Notificaciones en el Cliente

| Operación | Color de Badge | Color de Borde |
|-----------|----------------|----------------|
| CREATE | Verde | Verde |
| UPDATE | Naranja | Naranja |
| DELETE | Rojo | Rojo |
| CONFIRMAR | Azul | Azul |
| CANCELAR | Púrpura | Púrpura |

---

## 🚀 Próximos Pasos

1. Conectar múltiples clientes en diferentes navegadores/pestañas
2. Probar operaciones DELETE
3. Verificar que todas las entidades envían notificaciones
4. Probar con alta carga (muchas operaciones simultáneas)
5. Verificar que las notificaciones incluyen todos los datos correctos

---

## 💡 Tips

- El interceptor **no afecta** el funcionamiento normal del REST
- Las notificaciones son **asíncronas** y no bloquean las operaciones
- Puedes tener **múltiples clientes** conectados simultáneamente
- El WebSocket Gateway emite **globalmente** sin rooms
- Todas las notificaciones incluyen **metadata enriquecida**
