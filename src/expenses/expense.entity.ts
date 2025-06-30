import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ExpenseCategory } from '../enums/expense-category.enum';

@Entity({ name: 'expenses' })
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: ExpenseCategory })
  category: ExpenseCategory;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  userId: number;
} 