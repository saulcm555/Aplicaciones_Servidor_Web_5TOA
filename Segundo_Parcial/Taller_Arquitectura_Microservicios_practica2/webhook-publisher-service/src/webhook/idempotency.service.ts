import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class IdempotencyService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(IdempotencyService.name);
  private redis: Redis;
  
  // TTL de 1 HORA para Redis (deduplicación temporal)
  private readonly TTL_SECONDS = 60 * 60; // 3600 segundos
  
  // Prefijo para las claves en Redis
  private readonly PREFIX = 'webhook:dedup:';

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST') || 'microservices_redis';
    const port = parseInt(this.configService.get<string>('REDIS_PORT') || '6379');

    this.redis = new Redis({
      host,
      port,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.redis.on('connect', () => {
      this.logger.log(`Connected to Redis at ${host}:${port}`);
    });

    this.redis.on('error', (error) => {
      this.logger.error(`Redis error: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
      this.logger.log('Redis connection closed');
    }
  }

  /**
   * Genera la clave de Redis compuesta
   * Formato: eventName:idempotencyKey:subscriberId
   * Ejemplo: "product.stockReserved:abc-123:webhook-logger"
   */
  private getKey(eventName: string, idempotencyKey: string, subscriberId: string): string {
    return `${this.PREFIX}${eventName}:${idempotencyKey}:${subscriberId}`;
  }

  /**
   * Verifica si un evento ya fue procesado para un subscriber específico
   */
  async isProcessed(
    eventName: string,
    idempotencyKey: string,
    subscriberId: string,
  ): Promise<boolean> {
    try {
      const key = this.getKey(eventName, idempotencyKey, subscriberId);
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(`Error checking idempotency: ${error.message}`);
      // En caso de error de Redis, permitir el procesamiento
      // (fail-open para no bloquear el sistema)
      return false;
    }
  }

  /**
   * Marca un evento como procesado para un subscriber específico
   */
  async markAsProcessed(
    eventName: string,
    idempotencyKey: string,
    subscriberId: string,
  ): Promise<void> {
    try {
      const key = this.getKey(eventName, idempotencyKey, subscriberId);
      const value = JSON.stringify({
        processedAt: new Date().toISOString(),
        eventName,
        idempotencyKey,
        subscriberId,
      });

      // SET con TTL de 1 hora (deduplicación temporal)
      await this.redis.setex(key, this.TTL_SECONDS, value);

      this.logger.debug(
        ` Marked as processed (1h): ${eventName}:${subscriberId} | Key: ${idempotencyKey}`,
      );
    } catch (error) {
      this.logger.error(`Error marking as processed: ${error.message}`);
      // No lanzar error para no bloquear el procesamiento
    }
  }

  /**
   * Intenta procesar un evento de forma atómica (SET NX)
   * Retorna true si es la primera vez, false si ya existe
   */
  async tryProcess(
    eventName: string,
    idempotencyKey: string,
    subscriberId: string,
  ): Promise<boolean> {
    try {
      const key = this.getKey(eventName, idempotencyKey, subscriberId);
      const value = JSON.stringify({
        processedAt: new Date().toISOString(),
        eventName,
        idempotencyKey,
        subscriberId,
      });

      // SETNX (SET if Not eXists) + EX (TTL)
      const result = await this.redis.set(key, value, 'EX', this.TTL_SECONDS, 'NX');

      if (result === 'OK') {
        this.logger.debug(
          `First processing (1h): ${eventName}:${subscriberId} | Key: ${idempotencyKey}`,
        );
        return true;
      } else {
        this.logger.warn(
          `Already processed (duplicate): ${eventName}:${subscriberId} | Key: ${idempotencyKey}`,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(`Error in tryProcess: ${error.message}`);
      // Fail-open: permitir procesamiento en caso de error de Redis
      return true;
    }
  }

  /**
   * Elimina una clave de idempotencia (para testing o rollback)
   */
  async remove(eventName: string, idempotencyKey: string, subscriberId: string): Promise<void> {
    try {
      const key = this.getKey(eventName, idempotencyKey, subscriberId);
      await this.redis.del(key);
      this.logger.debug(`Removed: ${key}`);
    } catch (error) {
      this.logger.error(`Error removing key: ${error.message}`);
    }
  }

  /**
   * Obtiene estadísticas de Redis para debugging
   */
  async getStats(): Promise<{
    totalKeys: number;
    memoryUsed: string;
  }> {
    try {
      const keys = await this.redis.keys(`${this.PREFIX}*`);
      const info = await this.redis.info('memory');
      const memoryMatch = info.match(/used_memory_human:(.+)/);
      
      return {
        totalKeys: keys.length,
        memoryUsed: memoryMatch ? memoryMatch[1].trim() : 'unknown',
      };
    } catch (error) {
      this.logger.error(`Error getting stats: ${error.message}`);
      return { totalKeys: 0, memoryUsed: 'error' };
    }
  }
}
