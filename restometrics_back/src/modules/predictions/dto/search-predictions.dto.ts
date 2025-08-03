import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PredictionType, PredictionPeriod, ConfidenceLevel } from './prediction.dto';
import { BaseSearchDto } from '../../../shared/base';

export class SearchPredictionsDto extends BaseSearchDto {
  @ApiProperty({
    description: 'ID ресторана для фильтрации прогнозов',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  restaurantId?: string;

  @ApiProperty({
    description: 'Тип прогноза для фильтрации',
    enum: PredictionType,
    required: false,
    example: PredictionType.REVENUE,
  })
  @IsOptional()
  @IsEnum(PredictionType)
  predictionType?: PredictionType;

  @ApiProperty({
    description: 'Период прогнозирования для фильтрации',
    enum: PredictionPeriod,
    required: false,
    example: PredictionPeriod.HOURLY,
  })
  @IsOptional()
  @IsEnum(PredictionPeriod)
  period?: PredictionPeriod;

  @ApiProperty({
    description: 'Уровень доверия к прогнозу',
    enum: ConfidenceLevel,
    required: false,
    example: ConfidenceLevel.HIGH,
  })
  @IsOptional()
  @IsEnum(ConfidenceLevel)
  confidenceLevel?: ConfidenceLevel;

  @ApiProperty({
    description: 'Начальная дата для фильтрации прогнозов',
    required: false,
    example: '2025-08-03T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: Date;

  @ApiProperty({
    description: 'Конечная дата для фильтрации прогнозов',
    required: false,
    example: '2025-08-10T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: Date;

  @ApiProperty({
    description: 'Минимальный процент уверенности',
    required: false,
    example: 70,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value as string))
  minConfidenceScore?: number;
}
