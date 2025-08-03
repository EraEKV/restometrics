import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { PredictionType, PredictionPeriod } from './prediction.dto';
import { BaseCreateDto } from '../../../shared/base';

export class CreatePredictionDto extends BaseCreateDto {
  @ApiProperty({
    description: 'ID ресторана для которого создается прогноз',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  restaurantId: string;

  @ApiProperty({
    description: 'Дата и время для которого нужен прогноз',
    example: '2025-08-03T18:00:00.000Z',
  })
  @IsDateString()
  predictionDateTime: Date;

  @ApiProperty({
    description: 'Тип прогноза',
    enum: PredictionType,
    example: PredictionType.REVENUE,
  })
  @IsEnum(PredictionType)
  predictionType: PredictionType;

  @ApiProperty({
    description: 'Период прогнозирования',
    enum: PredictionPeriod,
    example: PredictionPeriod.HOURLY,
    required: false,
  })
  @IsOptional()
  @IsEnum(PredictionPeriod)
  period?: PredictionPeriod;
}
