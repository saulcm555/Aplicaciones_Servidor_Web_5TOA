-- Insertar suscriptores de webhooks para probar el sistema
-- Estos se leen dinámicamente desde Supabase en lugar de estar hardcodeados

-- Webhook Logger: Recibe TODOS los eventos
INSERT INTO webhook_subscribers (
  name, 
  webhook_url, 
  events,
  secret_key,
  is_active
) VALUES (
  'Webhook Logger',
  'https://zjynrmbugltvupttaxqz.supabase.co/functions/v1/webhook-logger',
  ARRAY['product.*', 'order.*'],
  'dev_secret_key_123456',
  true
) ON CONFLICT DO NOTHING;

-- Telegram Notifier: Solo eventos críticos
INSERT INTO webhook_subscribers (
  name, 
  webhook_url, 
  events,
  secret_key,
  is_active
) VALUES (
  'Telegram Notifier',
  'https://zjynrmbugltvupttaxqz.supabase.co/functions/v1/telegram-notifier',
  ARRAY['product.stockReserved', 'order.confirmed', 'order.cancelled'],
  'dev_secret_key_123456',
  true
) ON CONFLICT DO NOTHING;

-- Verificar
SELECT id, name, webhook_url, events, is_active 
FROM webhook_subscribers;
