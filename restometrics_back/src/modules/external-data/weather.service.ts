import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherDataDto, WeatherCondition, WeatherImpact, OpenMeteoResponse } from './dto';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private readonly configService: ConfigService) {}

  /**
   * Получить погодные данные для указанных координат и времени
   */
  async getWeatherData(
    latitude: number,
    longitude: number,
    dateTime: Date,
  ): Promise<WeatherDataDto> {
    try {
      const response = await this.fetchWeatherFromAPI(latitude, longitude);
      return this.processWeatherData(response, dateTime);
    } catch (error) {
      this.logger.error('Ошибка получения погодных данных:', error);
      return this.getDefaultWeatherData(dateTime);
    }
  }

  /**
   * Запрос к Open-Meteo API
   */
  private async fetchWeatherFromAPI(
    latitude: number,
    longitude: number,
  ): Promise<OpenMeteoResponse> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      hourly: 'temperature_2m,rain,humidity_2m,pressure_msl,wind_speed_10m',
      forecast_days: '1',
      format: 'json',
      timeformat: 'unixtime',
    });

    const url = `${this.baseUrl}?${params.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'RestOmetrics/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<OpenMeteoResponse>;
  }

  /**
   * Обработка ответа от API и извлечение данных для нужного времени
   */
  private processWeatherData(apiResponse: OpenMeteoResponse, targetDateTime: Date): WeatherDataDto {
    const targetTimestamp = Math.floor(targetDateTime.getTime() / 1000);

    const hourlyData = apiResponse.hourly;
    let closestIndex = 0;
    let minDiff = Math.abs(hourlyData.time[0] - targetTimestamp);

    for (let i = 1; i < hourlyData.time.length; i++) {
      const diff = Math.abs(hourlyData.time[i] - targetTimestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    }

    const temperature = hourlyData.temperature_2m[closestIndex];
    const rainfall = hourlyData.rain[closestIndex];
    const humidity = hourlyData.humidity_2m?.[closestIndex];
    const pressure = hourlyData.pressure_msl?.[closestIndex];
    const windSpeed = hourlyData.wind_speed_10m?.[closestIndex];

    const condition = this.determineWeatherCondition(temperature, rainfall);
    const impact = this.determineWeatherImpact(condition, temperature, rainfall);
    const impactMultiplier = this.calculateImpactMultiplier(impact, temperature, rainfall);
    const description = this.generateWeatherDescription(condition, temperature, rainfall, impact);

    return {
      dateTime: targetDateTime,
      temperature,
      rainfall,
      humidity,
      pressure,
      windSpeed,
      condition,
      impact,
      impactMultiplier,
      description,
    };
  }

  /**
   * Определение погодных условий на основе температуры и осадков
   */
  private determineWeatherCondition(temperature: number, rainfall: number): WeatherCondition {
    if (rainfall > 5) return WeatherCondition.STORMY;
    if (rainfall > 0.5) return WeatherCondition.RAINY;
    if (temperature < 0 && rainfall > 0) return WeatherCondition.SNOWY;
    if (temperature > 15 && temperature < 30) return WeatherCondition.CLEAR;
    return WeatherCondition.CLOUDY;
  }

  /**
   * Определение влияния погоды на посещаемость (для Казахстана)
   */
  private determineWeatherImpact(
    condition: WeatherCondition,
    temperature: number,
    rainfall: number,
  ): WeatherImpact {
    if (rainfall > 2 || temperature < -20 || temperature > 40) {
      return WeatherImpact.NEGATIVE;
    }
    if (condition === WeatherCondition.CLEAR && temperature >= 15 && temperature <= 28) {
      return WeatherImpact.POSITIVE;
    }
    return WeatherImpact.NEUTRAL;
  }

  /**
   * Расчет коэффициента влияния погоды на прогноз
   */
  private calculateImpactMultiplier(
    impact: WeatherImpact,
    temperature: number,
    rainfall: number,
  ): number {
    let multiplier = 1.0;

    switch (impact) {
      case WeatherImpact.POSITIVE:
        multiplier = 1.15;
        break;
      case WeatherImpact.NEGATIVE:
        multiplier = 0.75;
        break;
      case WeatherImpact.NEUTRAL:
        multiplier = 1.0;
        break;
    }

    if (rainfall > 10) multiplier *= 0.6;
    if (temperature < -30) multiplier *= 0.5;
    if (temperature > 45) multiplier *= 0.7;

    return Math.max(0.4, Math.min(1.4, multiplier));
  }

  /**
   * Генерация описания погодных условий
   */
  private generateWeatherDescription(
    condition: WeatherCondition,
    temperature: number,
    rainfall: number,
    impact: WeatherImpact,
  ): string {
    let description = '';

    switch (condition) {
      case WeatherCondition.CLEAR:
        description = 'Ясная погода';
        break;
      case WeatherCondition.CLOUDY:
        description = 'Облачная погода';
        break;
      case WeatherCondition.RAINY:
        description = rainfall > 2 ? 'Сильный дождь' : 'Небольшой дождь';
        break;
      case WeatherCondition.SNOWY:
        description = 'Снегопад';
        break;
      case WeatherCondition.STORMY:
        description = 'Гроза';
        break;
    }

    description += `, температура ${temperature > 0 ? '+' : ''}${Math.round(temperature)}°C.`;

    switch (impact) {
      case WeatherImpact.POSITIVE:
        description += ' Благоприятные условия для посещения ресторана.';
        break;
      case WeatherImpact.NEGATIVE:
        description += ' Неблагоприятная погода может снизить посещаемость.';
        break;
      case WeatherImpact.NEUTRAL:
        description += ' Погода не должна существенно влиять на посещаемость.';
        break;
    }

    return description;
  }

  /**
   * Данные по умолчанию при недоступности API
   */
  private getDefaultWeatherData(dateTime: Date): WeatherDataDto {
    // Для Казахстана - умеренная температура по сезону
    const month = dateTime.getMonth() + 1;
    let defaultTemp = 20;

    if (month >= 12 || month <= 2) {
      defaultTemp = -5;
    } else if (month >= 3 && month <= 5) {
      defaultTemp = 15;
    } else if (month >= 6 && month <= 8) {
      defaultTemp = 28;
    } else {
      defaultTemp = 10;
    }

    return {
      dateTime,
      temperature: defaultTemp,
      rainfall: 0,
      condition: WeatherCondition.CLOUDY,
      impact: WeatherImpact.NEUTRAL,
      impactMultiplier: 1.0,
      description: `Погодные данные недоступны. Предполагаемая температура ${defaultTemp}°C.`,
    };
  }

  /**
   * Получить координаты для крупных городов Казахстана
   */
  getCityCoordinates(city: string): { latitude: number; longitude: number } | null {
    const cities = {
      алматы: { latitude: 43.2775, longitude: 76.8958 },
      нурсултан: { latitude: 51.1694, longitude: 71.4491 },
      астана: { latitude: 51.1694, longitude: 71.4491 },
      шымкент: { latitude: 42.3, longitude: 69.5983 },
      караганда: { latitude: 49.8047, longitude: 73.1094 },
      актобе: { latitude: 50.2958, longitude: 57.1667 },
      тараз: { latitude: 42.9, longitude: 71.3667 },
      павлодар: { latitude: 52.2833, longitude: 76.9667 },
      усткаменогорск: { latitude: 49.9894, longitude: 82.6139 },
      семей: { latitude: 50.4111, longitude: 80.2275 },
    };

    return (cities as any)[city.toLowerCase()] || null;
  }
}
