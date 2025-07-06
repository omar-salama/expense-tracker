import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { IsYYYYMMDD } from '../decorators/is-yyyymmdd.decorator';
import { ExpenseCategory } from '../enums/expense-category.enum';
import { SortField } from '../enums/sort-field.enum';
import { SortOrder } from '../enums/sort-order.enum';

export class ExpenseFilterDto {
  @ApiPropertyOptional({ enum: SortField })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField = SortField.DATE;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  @ApiPropertyOptional({ enum: ExpenseCategory })
  @IsOptional()
  @IsEnum(ExpenseCategory)
  category?: ExpenseCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? Number(value) : undefined))
  minAmount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? Number(value) : undefined))
  maxAmount?: number;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsYYYYMMDD()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsYYYYMMDD()
  endDate?: string;
}
