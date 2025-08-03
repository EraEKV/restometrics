import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<string>;
  setex(key: string, seconds: number, value: string): Promise<string>;
  del(key: string): Promise<number>;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: IRedisClient | null = null;

  constructor() {
    void this.initializeRedis();
  }

  private async initializeRedis(): Promise<void> {
    try {
      const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
      const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

      if (upstashUrl && upstashToken) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { Redis } = await import('@upstash/redis');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.redisClient = new Redis({
          url: upstashUrl,
          token: upstashToken,
        }) as IRedisClient;
        this.logger.log('Redis Upstash клиент инициализирован');
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
      return result;
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
