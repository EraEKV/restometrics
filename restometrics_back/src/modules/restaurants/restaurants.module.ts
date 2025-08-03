import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { SessionService } from './session.service';
import { AuthModule } from '../auth';

@Module({
  imports: [AuthModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService, SessionService],
  exports: [RestaurantsService, SessionService],
})
export class RestaurantsModule {}
