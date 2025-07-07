import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';
import { IsYYYYMMDD } from '../decorators/is-yyyymmdd.decorator';

export class ExpenseReportQueryDto {
  @ApiPropertyOptional({ description: 'Start date (inclusive) in YYYY-MM-DD format' })
  @IsOptional()
  @IsYYYYMMDD()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (inclusive) in YYYY-MM-DD format' })
  @IsOptional()
  @IsYYYYMMDD()
  endDate?: string;
} 