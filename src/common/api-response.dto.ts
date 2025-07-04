import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty()
  data: T;

  @ApiProperty()
  message: string;

  @ApiProperty({ example: 'success' })
  status: string;
} 