import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ItemsRepository {
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
    const result = await this.pool.query('SELECT * FROM items WHERE is_active = true ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: number): Promise<any> {
    const result = await this.pool.query('SELECT * FROM items WHERE id = $1 AND is_active = true', [id]);
    return result.rows[0];
  }

  async findByName(name: string): Promise<any[]> {
    const result = await this.pool.query(
      'SELECT * FROM items WHERE name ILIKE $1 AND is_active = true ORDER BY created_at DESC',
      [`%${name}%`]
    );
    return result.rows;
  }

  async create(data: any): Promise<any> {
    const result = await this.pool.query(
      `INSERT INTO items (name, description, price, stock, category, barcode, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW()) RETURNING *`,
      [data.name, data.description, data.price, data.stock, data.category, data.barcode]
    );
    return result.rows[0];
  }

  async update(id: number, data: any): Promise<any> {
    const result = await this.pool.query(
      `UPDATE items SET name = $1, description = $2, price = $3, stock = $4, category = $5, barcode = $6, updated_at = NOW() 
       WHERE id = $7 RETURNING *`,
      [data.name, data.description, data.price, data.stock, data.category, data.barcode, id]
    );
    return result.rows[0];
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.pool.query(
      'UPDATE items SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING id',
      [id]
    );
    return !!result.rows[0];
  }
}
