import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq, desc, between, like } from 'drizzle-orm';
import { expenses, type Expense, type NewExpense } from '../db/schema';

@Injectable()
export class ExpensesRepository {
  constructor(
    @Inject('DATABASE') private db: any,
  ) {}

  async findAll(): Promise<Expense[]> {
    return this.db.select().from(expenses).orderBy(desc(expenses.expenseDate));
  }

  async findById(id: number): Promise<Expense | undefined> {
    const [expense] = await this.db.select().from(expenses).where(eq(expenses.id, id)).limit(1);
    return expense;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    return this.db
      .select()
      .from(expenses)
      .where(between(expenses.expenseDate, startDate, endDate))
      .orderBy(desc(expenses.expenseDate));
  }

  async create(data: NewExpense): Promise<Expense> {
    const [expense] = await this.db.insert(expenses).values(data).returning();
    return expense;
  }

  async delete(id: number): Promise<boolean> {
    const [expense] = await this.db.delete(expenses).where(eq(expenses.id, id)).returning();
    return !!expense;
  }
}
