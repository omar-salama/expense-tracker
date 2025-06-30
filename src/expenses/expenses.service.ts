import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create(createExpenseDto);
    return this.expenseRepository.save(expense);
  }

  async findAll(): Promise<Expense[]> {
    return this.expenseRepository.find();
  }

  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOneBy({ id });
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

  async remove(id: number): Promise<void> {
    const result = await this.expenseRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Expense not found');
  }
}
