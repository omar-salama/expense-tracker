import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedData } from '../common/paginated-data.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './expense.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: number): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      userId,
    });
    return this.expenseRepository.save(expense);
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    userId: number,
  ): Promise<PaginatedData<Expense[]>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const queryBuilder = this.expenseRepository.createQueryBuilder('expense');
    queryBuilder.where('expense.userId = :userId', { userId });
    queryBuilder.orderBy('expense.date', 'DESC');
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
}
