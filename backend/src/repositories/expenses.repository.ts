import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ExpensesRepository {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL || 
      'postgresql://nexa_user:nexa_pass_123@172.18.0.2:5432/nexa_db';
    
    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async findAll(): Promise<any[]> {
    const result = await this.pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
    return result.rows;
  }

  async findById(id: number): Promise<any> {
    const result = await this.pool.query('SELECT * FROM expenses WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT * FROM expenses WHERE expense_date BETWEEN $1 AND $2 ORDER BY expense_date DESC',
      [startDate, endDate]
    );
    return result.rows;
  }

  async create(data: any): Promise<any> {
    const result = await this.pool.query(
      `INSERT INTO expenses (expense_date, description, amount, category_id, category, notes, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`,
      [data.expenseDate || new Date(), data.description, data.amount, data.categoryId, data.category, data.notes]
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM expenses WHERE id = $1 RETURNING id', [id]);
    return !!result.rows[0];
  }
}
