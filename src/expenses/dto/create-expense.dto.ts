import { IsString, IsNumber, IsEnum, IsDateString, IsInt } from 'class-validator';
import { ExpenseCategory } from '../../enums/expense-category.enum';

export class CreateExpenseDto {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;

  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @IsDateString()
  date: string;

  @IsInt()
  userId: number;
} 