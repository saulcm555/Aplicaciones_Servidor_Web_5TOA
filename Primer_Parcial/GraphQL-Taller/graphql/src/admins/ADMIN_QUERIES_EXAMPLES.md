# 🔐 Ejemplos de Queries y Mutations para Admins

## 📋 Queries

### 1. Obtener todos los administradores

```graphql
query {
  admins {
    id_admin
    admin_name
    admin_email
    role
    created_at
  }
}
```

### 2. Obtener un administrador por ID

```graphql
query {
  admin(id: 1) {
    id_admin
    admin_name
    admin_email
    role
    created_at
  }
}
```

---

## ✏️ Mutations

### 1. Crear un nuevo administrador

```graphql
mutation {
  createAdmin(createAdminInput: {
    admin_name: "Juan Pérez"
    admin_email: "juan.perez@marketplace.com"
    admin_password: "securePass123"
    role: "super_admin"
  }) {
    id_admin
    admin_name
    admin_email
    role
    created_at
  }
}
```

### 2. Crear administrador sin rol (opcional)

```graphql
mutation {
  createAdmin(createAdminInput: {
    admin_name: "María García"
    admin_email: "maria.garcia@marketplace.com"
    admin_password: "password456"
  }) {
    id_admin
    admin_name
    admin_email
    role
    created_at
  }
}
```

### 3. Actualizar un administrador

```graphql
mutation {
  updateAdmin(updateAdminInput: {
    id_admin: 1
    admin_name: "Juan Pérez Actualizado"
    role: "admin"
  }) {
    id_admin
    admin_name
    admin_email
    role
    created_at
  }
}
```

### 4. Actualizar solo el email

```graphql
mutation {
  updateAdmin(updateAdminInput: {
    id_admin: 1
    admin_email: "nuevo.email@marketplace.com"
  }) {
    id_admin
    admin_name
    admin_email
    role
    created_at
  }
}
```

### 5. Actualizar la contraseña

```graphql
mutation {
  updateAdmin(updateAdminInput: {
    id_admin: 1
    admin_password: "newSecurePassword789"
  }) {
    id_admin
    admin_name
    admin_email
    created_at
  }
}
```

### 6. Eliminar un administrador

```graphql
mutation {
  removeAdmin(id: 1) {
    id_admin
    admin_name
    admin_email
    role
  }
}
```

---

## 🔍 Consultas Combinadas

### Crear y luego consultar

```graphql
# Primero crear
mutation CreateAdmin {
  createAdmin(createAdminInput: {
    admin_name: "Carlos Admin"
    admin_email: "carlos@marketplace.com"
    admin_password: "carlos123"
    role: "moderator"
  }) {
    id_admin
    admin_name
  }
}

# Luego obtener todos
query GetAllAdmins {
  admins {
    id_admin
    admin_name
    admin_email
    role
    created_at
  }
}
```

---

## 🎯 Roles Sugeridos

Puedes usar estos valores para el campo `role`:

- `super_admin` - Administrador con todos los permisos
- `admin` - Administrador regular
- `moderator` - Moderador con permisos limitados
- `support` - Soporte técnico
- O cualquier otro rol personalizado

---

## ⚠️ Validaciones Implementadas

### Campo `admin_name`:
- ✅ Requerido
- ✅ Debe ser string

### Campo `admin_email`:
- ✅ Requerido
- ✅ Formato de email válido
- ✅ Debe ser único (validado en la API REST)

### Campo `admin_password`:
- ✅ Requerido
- ✅ Mínimo 6 caracteres
- ✅ Debe ser string

### Campo `role`:
- ✅ Opcional
- ✅ Debe ser string si se proporciona

---

## 🚀 Cómo Probar

1. **Asegúrate de que ambos servidores estén corriendo:**
   ```powershell
   # Terminal 1 - REST API (puerto 3000)
   cd marketplaceNestJS
   npm run start:dev

   # Terminal 2 - GraphQL (puerto 3001)
   cd graphql
   npm run start:dev
   ```

2. **Abre el Playground:**
   - URL: http://localhost:3001/graphql

3. **Copia y pega** cualquiera de los ejemplos anteriores

4. **Presiona el botón** ▶️ para ejecutar

---

## 📝 Notas Importantes

- ⚠️ La contraseña se muestra en la respuesta (en producción debería ocultarse)
- ⚠️ Asegúrate de que el endpoint `/api/v1/admins` esté disponible en tu REST API
- ⚠️ El email debe ser único en la base de datos
- ✅ Todos los campos tienen validaciones automáticas
- ✅ Los errores se propagan correctamente desde la REST API

---

## 🎉 ¡Listo para Usar!

El módulo de administradores está completamente funcional con:
- ✅ Queries (findAll, findOne)
- ✅ Mutations (create, update, remove)
- ✅ Validaciones completas
- ✅ Manejo de errores
- ✅ Documentación en el schema
