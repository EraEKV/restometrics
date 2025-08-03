import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class BaseCreateDto {
  @ApiProperty({
    description: 'Представление объекта (для отображения в UI)',
    example: 'Название объекта',
    required: false,
  })
  @IsOptional()
  @IsString()
  represent?: string;
}
