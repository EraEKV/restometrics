import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { DatabaseModule } from './core/database';
// import { RedisModule } from './core/redis';
import { LoggerModule } from './core/logger';
import { RestaurantsModule, AuthModule } from './modules';
import { PredictionsModule } from './modules/predictions';
import { ExternalDataModule } from './modules/external-data';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // DatabaseModule,
    LoggerModule,
    // RedisModule,
    ExternalDataModule,
    AuthModule,
    RestaurantsModule,
    PredictionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
