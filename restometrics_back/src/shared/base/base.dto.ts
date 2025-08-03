import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional, IsString } from 'class-validator';

export class BaseEntityDto {
  @ApiProperty({
    description: 'Уникальный идентификатор',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Дата создания записи',
    example: '2025-08-03T10:30:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  createDate: Date;

  @ApiProperty({
    description: 'Дата последнего обновления записи',
    example: '2025-08-03T15:45:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  @IsDateString()
  updateDate: Date;

  @ApiProperty({
    description: 'Представление объекта (для отображения в UI)',
    example: 'Название объекта',
    required: false,
  })
  @IsOptional()
  @IsString()
  represent?: string;
}
