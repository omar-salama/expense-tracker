import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';

export class ApiPaginatedResponseDto<T> extends ApiResponseDto<T> {
  @ApiProperty()
  meta: { page: number; limit: number; total: number };
}
