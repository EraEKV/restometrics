import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход по registration_id ресторана' })
  @ApiBody({
    schema: {
      properties: { registration_id: { type: 'string', example: 'REST_123456' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход, sessionId в httpOnly cookie',
    schema: {
      properties: {
        message: { type: 'string', example: 'Успешный вход' },
        restaurantId: { type: 'string', example: 'uuid-ресторана' },
        sessionId: { type: 'string', example: 'uuid-сессии' },
        restaurant: { type: 'object', description: 'Данные ресторана' },
      },
    },
  })
  async login(
    @Body('registration_id') registrationId: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    if (!registrationId) {
      throw new BadRequestException('registration_id обязателен');
    }

    // Проверяем, существует ли ресторан с таким registration_id
    let restaurant = await this.restaurantsService.findByRegistrationId(registrationId);

    // Если ресторан не найден, создаем его с базовыми данными
    if (!restaurant) {
      const createRestaurantResult =
        await this.restaurantsService.createFromRegistrationId(registrationId);

      if (!createRestaurantResult.data) {
        throw new BadRequestException('Ошибка при создании ресторана');
      }

      restaurant = createRestaurantResult.data;
    }

    // Создаем сессию
    const sessionId = uuidv4();
    await this.authService.saveSession(sessionId, restaurant.id);

    // Устанавливаем httpOnly cookie
    res.setCookie('sessionId', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 * 1000, // 7 дней
    });

    return {
      message: 'Успешный вход',
      restaurantId: restaurant.id,
      sessionId: sessionId,
      restaurant,
    };
  }
}
