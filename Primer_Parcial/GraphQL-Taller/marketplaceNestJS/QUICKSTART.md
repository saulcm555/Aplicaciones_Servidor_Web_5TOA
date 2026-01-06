# 🚀 Quick Start Guide - Marketplace Backend

## ⚡ Inicio Rápido (5 minutos)

### 1. Prerequisitos
- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 2. Instalar Dependencias ✅ (Ya instaladas)
```bash
npm install
```

### 3. Configurar Base de Datos

#### Opción A: PostgreSQL Local
```sql
-- Crear base de datos
CREATE DATABASE marketplace;
```

#### Opción B: Usar Docker
```bash
docker run --name postgres-marketplace \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=marketplace \
  -p 5432:5432 \
  -d postgres:14
```

### 4. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales (ya tiene valores por defecto)
```

Contenido de `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=marketplace
PORT=3000
```

### 5. Ejecutar la Aplicación
```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# La aplicación estará en http://localhost:3000
```

### 6. Verificar que Funciona
```bash
# En otra terminal, hacer una petición de prueba
curl http://localhost:3000/clients
```

Deberías ver una respuesta JSON (probablemente un array vacío `[]`).

---

## 📊 Poblar con Datos de Prueba (Opcional)

Una vez que la aplicación esté corriendo y las tablas creadas automáticamente por TypeORM:

```bash
# Ejecutar el script SQL de datos de prueba
psql -U postgres -d marketplace -f database-test-data.sql
```

O desde pgAdmin/DBeaver, ejecuta el contenido de `database-test-data.sql`.

---

## 🧪 Probar los Endpoints

### Opción 1: Usar Postman
1. Abre Postman
2. Importa el archivo `marketplace-api.postman_collection.json`
3. ¡Empieza a probar los endpoints!

### Opción 2: Usar curl

#### Crear un cliente
```bash
curl -X POST http://localhost:3000/clients \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "Test User",
    "client_email": "test@example.com",
    "client_password": "password123",
    "phone": "0999999999",
    "address": "Test Address 123"
  }'
```

#### Listar clientes
```bash
curl http://localhost:3000/clients
```

#### Crear un carrito
```bash
curl -X POST http://localhost:3000/carts \
  -H "Content-Type: application/json" \
  -d '{
    "id_client": 1,
    "status": "active"
  }'
```

#### Agregar producto al carrito
```bash
curl -X POST http://localhost:3000/carts/1/items \
  -H "Content-Type: application/json" \
  -d '{
    "id_product": 1,
    "quantity": 2
  }'
```

---

## 📁 Archivos de Documentación

- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - Documentación completa de todos los endpoints
- **[RESUMEN_IMPLEMENTACION.md](./RESUMEN_IMPLEMENTACION.md)** - Resumen técnico detallado
- **[database-test-data.sql](./database-test-data.sql)** - Script con datos de prueba
- **[marketplace-api.postman_collection.json](./marketplace-api.postman_collection.json)** - Colección Postman

---

## 🐛 Troubleshooting Común

### Error: "Cannot connect to database"
✅ Verifica que PostgreSQL esté corriendo
✅ Verifica las credenciales en `.env`
✅ Verifica que la base de datos `marketplace` exista

### Error: "Port 3000 already in use"
✅ Cambia el puerto en `.env`: `PORT=3001`
✅ O cierra la aplicación que usa el puerto 3000

---

## ✅ Checklist de Verificación

- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `marketplace` creada
- [ ] Archivo `.env` configurado
- [ ] Dependencias instaladas
- [ ] Aplicación corriendo en http://localhost:3000
- [ ] Endpoint de clientes responde correctamente

---

## 🎉 ¡Todo Listo!

Tu backend de marketplace está completamente configurado. Revisa la **API_DOCUMENTATION.md** para ver todos los endpoints disponibles.
