import { Injectable } from '@nestjs/common';
import { DatabaseService } from './core/database';

@Injectable()
export class AppService {
  constructor(private readonly dbService: DatabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
