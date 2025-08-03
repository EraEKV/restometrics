import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({
    description: 'Статус выполнения запроса',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Сообщение о результате выполнения',
    example: 'Операция выполнена успешно',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'Данные ответа',
  })
  data?: T;

  @ApiProperty({
    description: 'Информация об ошибке',
    required: false,
  })
  error?: {
    code: string;
    message: string;
    details?: any;
  };

  constructor(data?: T, message?: string) {
    this.success = true;
    this.data = data;
    this.message = message;
  }

  static success<T>(data?: T, message?: string): BaseResponseDto<T> {
    return new BaseResponseDto(data, message);
  }

  static error<T>(error: { code: string; message: string; details?: any }): BaseResponseDto<T> {
    const response = new BaseResponseDto<T>();
    response.success = false;
    response.error = error;
    return response;
  }
}

export class PaginatedResponseDto<T> extends BaseResponseDto<T[]> {
  @ApiProperty({
    description: 'Информация о пагинации',
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  constructor(
    data: T[],
    pagination: { page: number; limit: number; total: number; totalPages: number },
    message?: string,
  ) {
    super(data, message);
    this.pagination = pagination;
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string,
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(total / limit);
    const pagination = { page, limit, total, totalPages };
    return new PaginatedResponseDto(data, pagination, message);
  }
}
