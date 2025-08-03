import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request & { restaurantId?: string }, res: Response, next: NextFunction) {
    const sessionId = req.cookies?.sessionId as string | undefined;
    if (sessionId) {
      const restaurantId = await this.authService.getRestaurantIdBySession(sessionId);
      if (restaurantId) {
        req.restaurantId = restaurantId;
      }
    }
    next();
  }
}
