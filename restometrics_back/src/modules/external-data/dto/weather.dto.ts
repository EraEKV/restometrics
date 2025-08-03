import { ApiProperty } from '@nestjs/swagger';

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  hourly_units: {
    time: string;
    temperature_2m: string;
    rain: string;
    humidity_2m?: string;
    pressure_msl?: string;
    wind_speed_10m?: string;
  };
  hourly: {
    time: number[];
    temperature_2m: number[];
    rain: number[];
    humidity_2m?: number[];
    pressure_msl?: number[];
    wind_speed_10m?: number[];
  };
}

export enum WeatherCondition {
  CLEAR = 'clear',
  CLOUDY = 'cloudy',
  RAINY = 'rainy',
  SNOWY = 'snowy',
  STORMY = 'stormy',
}

export enum WeatherImpact {
  POSITIVE = 'positive', // Хорошая погода привлекает людей
  NEUTRAL = 'neutral', // Погода не влияет
  NEGATIVE = 'negative', // Плохая погода отпугивает людей
}

export class WeatherDataDto {
  @ApiProperty({
    description: 'Дата и время прогноза погоды',
    example: '2025-08-03T18:00:00.000Z',
  })
  dateTime: Date;

  @ApiProperty({
    description: 'Температура воздуха в градусах Цельсия',
    example: 24.5,
  })
  temperature: number;

  @ApiProperty({
    description: 'Количество осадков в мм/час',
    example: 0.0,
  })
  rainfall: number;

  @ApiProperty({
    description: 'Влажность воздуха в процентах',
    example: 65,
    required: false,
  })
  humidity?: number;

  @ApiProperty({
    description: 'Атмосферное давление в гПа',
    example: 1013.25,
    required: false,
  })
  pressure?: number;

  @ApiProperty({
    description: 'Скорость ветра в м/с',
    example: 3.2,
    required: false,
  })
  windSpeed?: number;

  @ApiProperty({
    description: 'Условия погоды',
    enum: WeatherCondition,
    example: WeatherCondition.CLEAR,
  })
  condition: WeatherCondition;

  @ApiProperty({
    description: 'Влияние погоды на посещаемость',
    enum: WeatherImpact,
    example: WeatherImpact.POSITIVE,
  })
  impact: WeatherImpact;

  @ApiProperty({
    description: 'Коэффициент влияния погоды на прогноз (0.5 - 1.5)',
    example: 1.1,
  })
  impactMultiplier: number;

  @ApiProperty({
    description: 'Описание погодных условий на русском языке',
    example: 'Ясная погода, температура +24°C. Благоприятные условия для посещения ресторана.',
  })
  description: string;
}

export type WeatherDto = WeatherDataDto;
