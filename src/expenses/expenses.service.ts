import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginatedData } from '../common/paginated-data.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseFilterDto } from './dto/expense-filter.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { SortField } from './enums/sort-field.enum';
import { SortOrder } from './enums/sort-order.enum';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userId: number,
  ): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      userId,
    });
    return this.expenseRepository.save(expense);
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    filterQuery: ExpenseFilterDto,
    userId: number,
  ): Promise<PaginatedData<Expense[]>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const { sortBy = SortField.DATE, sortOrder = SortOrder.DESC } = filterQuery;

    const queryBuilder = this.expenseRepository.createQueryBuilder('expense');

    queryBuilder.where('expense.userId = :userId', { userId });

    this.applyExpenseFilters(queryBuilder, filterQuery);

    queryBuilder.orderBy(`expense.${sortBy}`, sortOrder);

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [expenses, total] = await queryBuilder.getManyAndCount();

    return {
      data: expenses,
      meta: {
        page,
        limit,
        total,
      },
    };
  }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOneBy({ id });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async findOneById(id: number, userId: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOneBy({ id, userId });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async update(
    id: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(id);
    Object.assign(expense, updateExpenseDto);
    return this.expenseRepository.save(expense);
  }

  async updateOneById(
    id: number,
    userId: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOneById(id, userId);
    Object.assign(expense, updateExpenseDto);
    return this.expenseRepository.save(expense);
  }

  async remove(id: number): Promise<void> {
    const result = await this.expenseRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Expense not found');
  }

  async removeOneById(id: number, userId: number): Promise<void> {
    const result = await this.expenseRepository.delete({ id, userId });
    if (result.affected === 0) throw new NotFoundException('Expense not found');
  }

  private applyExpenseFilters(
    queryBuilder: SelectQueryBuilder<Expense>,
    filters: ExpenseFilterDto,
  ) {
    const { category, title, minAmount, maxAmount, startDate, endDate } =
      filters;

    if (category) {
      queryBuilder.andWhere('expense.category = :category', { category });
    }
    if (title) {
      queryBuilder.andWhere('LOWER(expense.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }
    if (minAmount !== undefined) {
      queryBuilder.andWhere('expense.amount >= :minAmount', { minAmount });
    }
    if (maxAmount !== undefined) {
      queryBuilder.andWhere('expense.amount <= :maxAmount', { maxAmount });
    }
    if (startDate) {
      queryBuilder.andWhere('expense.date >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('expense.date <= :endDate', { endDate });
    }
  }
}
