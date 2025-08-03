import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  onModuleInit() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  onModuleDestroy() {
    if (this.redis) this.redis.disconnect();
  }

  /**
   * Сохраняет сессию (sessionId -> restaurantId UUID)
   */
  async saveSession(sessionId: string, restaurantId: string): Promise<void> {
    await this.redis.set(`session:${sessionId}`, restaurantId, 'EX', 60 * 60 * 24 * 7); // 7 дней
  }

  /**
   * Получить restaurantId UUID по sessionId
   */
  async getRestaurantIdBySession(sessionId: string): Promise<string | null> {
    const val = await this.redis.get(`session:${sessionId}`);
    return val || null;
  }

  /**
   * Удалить сессию
   */
  async removeSession(sessionId: string): Promise<void> {
    await this.redis.del(`session:${sessionId}`);
  }
}
