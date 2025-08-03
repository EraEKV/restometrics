import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PredictionType, PredictionPeriod } from './prediction.dto';

export class PredictionRequestDto {
  @ApiProperty({
    description:
      'ID ресторана для которого запрашивается прогноз (опционально, автоматически берется из сессии)',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  restaurantId?: string;

  @ApiProperty({
    description: 'Дата и время для которого нужен прогноз (по умолчанию - текущее время)',
    required: false,
    example: '2025-08-03T18:00:00.000Z',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  predictionDateTime?: Date;

  @ApiProperty({
    description: 'Тип прогноза',
    enum: PredictionType,
    example: PredictionType.REVENUE,
    default: PredictionType.REVENUE,
  })
  @IsOptional()
  @IsEnum(PredictionType)
  predictionType?: PredictionType;

  @ApiProperty({
    description: 'Период прогнозирования',
    enum: PredictionPeriod,
    example: PredictionPeriod.HOURLY,
    default: PredictionPeriod.HOURLY,
  })
  @IsOptional()
  @IsEnum(PredictionPeriod)
  period?: PredictionPeriod;
}
