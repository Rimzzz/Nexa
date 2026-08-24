import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TransactionsRepository {
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
    const result = await this.pool.query('SELECT * FROM transactions ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: number): Promise<any> {
    const result = await this.pool.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT * FROM transactions WHERE transaction_date BETWEEN $1 AND $2 ORDER BY transaction_date DESC',
      [startDate, endDate]
    );
    return result.rows;
  }

  async createTransaction(data: any): Promise<any> {
    const result = await this.pool.query(
      `INSERT INTO transactions (transaction_date, subtotal, tax, discount, total, payment_method, notes, cashier_id, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *`,
      [data.transactionDate || new Date(), data.subtotal, data.tax, data.discount, data.total, data.paymentMethod, data.notes, data.cashierId]
    );
    return result.rows[0];
  }

  async createTransactionItems(items: any[]): Promise<void> {
    if (items.length === 0) return;
    
    const values = items.map((item, idx) => 
      `($${idx * 5 + 1}, $${idx * 5 + 2}, $${idx * 5 + 3}, $${idx * 5 + 4}, $${idx * 5 + 5})`
    ).join(', ');
    
    const params = items.flatMap(item => [
      item.transactionId,
      item.itemName,
      item.quantity,
      item.price,
      item.subtotal
    ]);
    
    await this.pool.query(
      `INSERT INTO transaction_items (transaction_id, item_name, quantity, price, subtotal, created_at) 
       VALUES ${values}, (NOW())`,
      params
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM transactions WHERE id = $1 RETURNING id', [id]);
    return !!result.rows[0];
  }
}
