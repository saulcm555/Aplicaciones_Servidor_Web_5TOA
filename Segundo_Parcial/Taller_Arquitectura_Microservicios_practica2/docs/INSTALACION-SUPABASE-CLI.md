# Opciones de Instalación Supabase CLI

## ❌ NO FUNCIONA
```powershell
npm install -g supabase  # ERROR: Not supported
```

## ✅ Opción 1: Usar npx (SIN instalar)
```powershell
cd "c:\Users\saulc\OneDrive\Documentos\Universidad\QuintoSemestre\EVENT-DRIVEN CON WEBHOOKS Y SERVERLESS - PRACTICA\Taller_Arquitectura_Microservicios\supabase"

# Login
npx supabase login

# Link proyecto
npx supabase link --project-ref zjynrmbugltvupttaxqz

# Deploy
npx supabase functions deploy webhook-logger
npx supabase functions deploy telegram-notifier
```

## ✅ Opción 2: Scoop (Recomendado Windows)
```powershell
# Instalar Scoop primero
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Luego Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

## ✅ Opción 3: Deploy Manual Dashboard
1. Ve a https://supabase.com/dashboard/project/zjynrmbugltvupttaxqz/functions
2. Edita cada función manualmente
3. Copia código de los archivos locales

## 🔍 Los errores TypeScript son NORMALES
Los archivos son Deno (runtime de Edge Functions), no Node.js.

**YA CREÉ LA CONFIGURACIÓN** en:
- `.vscode/settings.json` (habilita Deno)
- `supabase/functions/deno.json` (tipos Deno)

**Recarga VS Code**: Ctrl+Shift+P → "Developer: Reload Window"
