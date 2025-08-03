import 'express';

declare module 'express' {
  interface Request {
    restaurantId?: string;
  }
}
