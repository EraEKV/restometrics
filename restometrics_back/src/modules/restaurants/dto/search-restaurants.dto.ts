import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseSearchDto } from '../../../shared/base';
import { RestaurantStatus } from '../../../core/database/database.types';

export class SearchRestaurantsDto extends BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Фильтр по названию ресторана',
    example: 'Золотой кувшин',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по адресу',
    example: 'улица Акан Серы',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по статусу ресторана',
    example: 'approved',
    enum: RestaurantStatus,
  })
  @IsOptional()
  @IsEnum(RestaurantStatus)
  status?: RestaurantStatus;

  @ApiPropertyOptional({
    description: 'Фильтр по наличию меню',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasMenu?: boolean;

  @ApiPropertyOptional({
    description: 'Фильтр по имени владельца',
    example: 'Ерасыл',
  })
  @IsOptional()
  @IsString()
  ownerName?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по email владельца',
    example: 'kokenaoerasyl@gmail.com',
  })
  @IsOptional()
  @IsString()
  ownerEmail?: string;

  @ApiPropertyOptional({
    description: 'Фильтр по ID регистрации',
    example: 'rest_1754165064110',
  })
  @IsOptional()
  @IsString()
  registrationId?: string;
}
