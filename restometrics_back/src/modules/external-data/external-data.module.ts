import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { GeminiService } from './gemini.service';

@Module({
  providers: [WeatherService, GeminiService],
  exports: [WeatherService, GeminiService],
})
export class ExternalDataModule {}
