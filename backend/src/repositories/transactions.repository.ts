import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { eq, desc, between, like } from 'drizzle-orm';
import { transactions, transactionItems, type Transaction, type NewTransaction, type NewTransactionItem } from '../db/schema';

@Injectable()
export class TransactionsRepository {
  constructor(
    @Inject('DATABASE') private db: any,
  ) {}

  async findAll(): Promise<Transaction[]> {
    return this.db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }

  async findById(id: number): Promise<Transaction | undefined> {
    const [transaction] = await this.db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    return transaction;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return this.db
      .select()
      .from(transactions)
      .where(between(transactions.transactionDate, startDate, endDate))
      .orderBy(desc(transactions.transactionDate));
  }

  async create(data: NewTransaction): Promise<Transaction> {
    const [transaction] = await this.db.insert(transactions).values(data).returning();
    return transaction;
  }

  async createItems(items: NewTransactionItem[]): Promise<void> {
    if (items.length === 0) return;
    await this.db.insert(transactionItems).values(items);
  }

  async delete(id: number): Promise<boolean> {
    const [transaction] = await this.db.delete(transactions).where(eq(transactions.id, id)).returning();
    return !!transaction;
  }
}
