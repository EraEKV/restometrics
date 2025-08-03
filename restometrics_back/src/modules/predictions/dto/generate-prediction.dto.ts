import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNumber,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PredictionType, PredictionPeriod } from './prediction.dto';

export class CoordinatesDto {
  @ApiProperty({
    description: 'Широта',
    example: 43.262774,
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    description: 'Долгота',
    example: 76.945465,
  })
  @IsNumber()
  lng: number;
}

export class GeneratePredictionDto {
  @ApiProperty({
    description: 'Название ресторана',
    example: 'Ресторан Алтын',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Адрес ресторана',
    example: 'ул. Назарбаева 12, Алматы',
  })
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Координаты ресторана',
    type: CoordinatesDto,
  })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({
    description: 'Дата и время для которого нужен прогноз',
    example: '2025-08-03T19:00:00.000Z',
  })
  @IsDateString()
  dateTime: string;

  @ApiProperty({
    description: 'Тип прогноза',
    enum: PredictionType,
    required: false,
    example: PredictionType.REVENUE,
  })
  @IsOptional()
  @IsEnum(PredictionType)
  predictionType?: PredictionType;

  @ApiProperty({
    description: 'Период прогноза',
    enum: PredictionPeriod,
    required: false,
    example: PredictionPeriod.DAILY,
  })
  @IsOptional()
  @IsEnum(PredictionPeriod)
  period?: PredictionPeriod;
}
