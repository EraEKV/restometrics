import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis | null = null;

  constructor() {
    this.initializeRedis();
  }

  private initializeRedis(): void {
    try {
      const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
      const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

      if (upstashUrl && upstashToken) {
        this.redisClient = new Redis({
          url: upstashUrl,
          token: upstashToken,
        });
        this.logger.log('Redis Upstash клиет инициализирован');
      } else {
        this.logger.warn('UPSTASH_REDIS_REST_URL или UPSTASH_REDIS_REST_TOKEN не найдены');
      }
    } catch (error) {
      this.logger.error('Ошибка инициализации Redis:', error);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.redisClient) {
      return null;
    }

    try {
      const result = await this.redisClient.get(key);
      return result as string | null;
    } catch (error) {
      this.logger.error('Ошибка получения данных из Redis:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!this.redisClient) {
      return false;
    }

    try {
      if (ttlSeconds) {
        await this.redisClient.setex(key, ttlSeconds, value);
      } else {
        await this.redisClient.set(key, value);
      }
      return true;
    } catch (error) {
      this.logger.error('Ошибка сохранения данных в Redis:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.redisClient) {
      return false;
    }

    try {
      await this.redisClient.del(key);
      return true;
    } catch (error) {
      this.logger.error('Ошибка удаления данных из Redis:', error);
      return false;
    }
  }

  onModuleDestroy(): void {
    this.logger.log('Redis сервис завершен');
  }
}
