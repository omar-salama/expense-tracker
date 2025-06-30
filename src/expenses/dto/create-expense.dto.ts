import {
  IsString,
  IsNumber,
  IsEnum,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../../enums/expense-category.enum';
import { IsYYYYMMDD } from '../decorators/is-yyyymmdd.decorator';

export class CreateExpenseDto {
  @ApiProperty({ example: 'Lunch' })
  @IsString()
  title: string;

  @ApiProperty({ example: 12.5 })
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: ExpenseCategory })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({ example: '2025-06-30' })
  @IsYYYYMMDD()
  date: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;
}
