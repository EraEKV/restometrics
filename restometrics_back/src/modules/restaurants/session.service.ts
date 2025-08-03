import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../../core/database';

@Injectable()
export class SessionService {
  constructor(
    private readonly authService: AuthService,
    private readonly databaseService: DatabaseService,
  ) {}

  /**
   * Получить данные ресторана по sessionId из cookie
   */
  async getRestaurantBySession(sessionId: string) {
    if (!sessionId) return null;

    const restaurantId = await this.authService.getRestaurantIdBySession(sessionId);
    if (!restaurantId) return null;

    // TODO: Получить данные ресторана из БД
    // const restaurant = await this.databaseService.db
    //   .selectFrom('restaurants')
    //   .where('registration_id', '=', restaurantId)
    //   .selectAll()
    //   .executeTakeFirst();

    return { restaurantId }; // Заглушка
  }

  /**
   * Проверить, принадлежит ли ресторан данной сессии
   */
  async canAccessRestaurant(sessionId: string, restaurantId: string): Promise<boolean> {
    if (!sessionId) return false;

    const sessionRestaurantId = await this.authService.getRestaurantIdBySession(sessionId);
    return sessionRestaurantId === restaurantId;
  }
}
