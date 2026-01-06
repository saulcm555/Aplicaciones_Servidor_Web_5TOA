#!/bin/bash
# Script para configurar bindings del webhook-publisher al Topic Exchange

set -e

echo "🔧 Configurando bindings de webhook-publisher..."

# Esperar a que RabbitMQ esté disponible
until rabbitmqctl await_startup; do
  echo "Esperando RabbitMQ..."
  sleep 2
done

# Nombre del exchange y cola
EXCHANGE="microservices.events"
QUEUE="webhook_publisher_queue"

# Crear cola si no existe (idempotente)
rabbitmqadmin declare queue name="$QUEUE" durable=true

# Bind patterns que webhook-publisher necesita escuchar
PATTERNS=("product.stockReserved" "order.confirmed" "order.cancelled" "product.*" "order.*")

for PATTERN in "${PATTERNS[@]}"; do
  echo "📌 Binding $QUEUE -> $EXCHANGE con routing_key=$PATTERN"
  rabbitmqadmin declare binding \
    source="$EXCHANGE" \
    destination="$QUEUE" \
    routing_key="$PATTERN" \
    || true # Ignorar si ya existe
done

echo "✅ Bindings configurados correctamente"
rabbitmqadmin list bindings source destination routing_key | grep "$QUEUE"
