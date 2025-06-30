import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../../enums/expense-category.enum';

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
  @IsDateString()
  date: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;
}
