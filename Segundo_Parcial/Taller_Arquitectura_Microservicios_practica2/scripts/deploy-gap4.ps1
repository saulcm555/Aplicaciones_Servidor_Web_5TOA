# =========================================================
# Script para Deploy de Edge Functions Actualizadas
# GAP 4 - Estrategia de Idempotencia con RPC
# =========================================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Deploy Edge Functions con Idempotencia" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$functionsPath = "c:\Users\saulc\OneDrive\Documentos\Universidad\QuintoSemestre\EVENT-DRIVEN CON WEBHOOKS Y SERVERLESS - PRACTICA\Taller_Arquitectura_Microservicios\supabase\functions"

# Verificar que existe Supabase CLI
try {
    $supabaseVersion = supabase --version
    Write-Host "Supabase CLI: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "Supabase CLI no encontrado. Instala con: npm install -g supabase" -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/3] Deploying webhook-logger..." -ForegroundColor Yellow
try {
    Set-Location $functionsPath
    supabase functions deploy webhook-logger
    Write-Host "webhook-logger deployed" -ForegroundColor Green
} catch {
    Write-Host "Error deploying webhook-logger: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n[2/3] Deploying telegram-notifier..." -ForegroundColor Yellow
try {
    supabase functions deploy telegram-notifier
    Write-Host "telegram-notifier deployed" -ForegroundColor Green
} catch {
    Write-Host "Error deploying telegram-notifier: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n[3/3] Rebuild webhook-publisher-service..." -ForegroundColor Yellow
Set-Location "c:\Users\saulc\OneDrive\Documentos\Universidad\QuintoSemestre\EVENT-DRIVEN CON WEBHOOKS Y SERVERLESS - PRACTICA\Taller_Arquitectura_Microservicios"
docker-compose up -d --build webhook-publisher-service

Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host " Deployment Completado" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Write-Host "`nSiguiente paso: Probar duplicados" -ForegroundColor Magenta
Write-Host @"

Prueba de idempotencia:

# 1. Enviar un evento
curl -X POST http://localhost:3000/orders \\
  -H "Content-Type: application/json" \\
  -d '{"productId": "P001", "quantity": 5}'

# 2. Verificar Redis (debe haber 2 claves: webhook-logger + telegram-notifier)
docker exec -it webhook-publisher-service redis-cli KEYS "webhook:dedup:*"

# 3. Verificar Supabase (debe haber 1 registro en processed_webhooks)
# SELECT * FROM processed_webhooks ORDER BY created_at DESC LIMIT 5;

# 4. Enviar el MISMO evento otra vez (debe ser bloqueado)
# Reenviar el mismo curl y verificar logs

"@ -ForegroundColor White

Write-Host "Ver logs:" -ForegroundColor Yellow
Write-Host "docker logs webhook-publisher-service -f" -ForegroundColor White
