import { Module } from '@nestjs/common';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';
import { WeatherService } from '../external-data/weather.service';
import { GeminiService } from '../external-data/gemini.service';

@Module({
  controllers: [PredictionsController],
  providers: [PredictionsService, WeatherService, GeminiService],
  exports: [PredictionsService],
})
export class PredictionsModule {}
