import { ApiProperty } from '@nestjs/swagger';

export class ExpenseSummaryPerCategoryDto {
  @ApiProperty({ description: 'Category name' })
  category: string;

  @ApiProperty({ description: 'Total spent in this category' })
  total: number;
}

export class ExpenseSummaryMonthlyDto {
  @ApiProperty({ description: 'Month in YYYY-MM format' })
  month: string;

  @ApiProperty({ description: 'Total spent in this month' })
  total: number;
}

export class ExpenseSummaryReportDto {
  @ApiProperty({ description: 'Total spent in the period' })
  total: number;

  @ApiProperty({ type: [ExpenseSummaryPerCategoryDto], description: 'Total spent per category' })
  perCategory: ExpenseSummaryPerCategoryDto[];

  @ApiProperty({ type: [ExpenseSummaryMonthlyDto], description: 'Monthly breakdown' })
  monthly: ExpenseSummaryMonthlyDto[];
} 