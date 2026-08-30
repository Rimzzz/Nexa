import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersRepository {
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

  async findAll() {
    const result = await this.pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return result.rows;
  }

  async findById(id: number) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0];
  }

  async findByUsername(username: string) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE username = $1 LIMIT 1',
      [username]
    );
    return result.rows[0];
  }

  async findByEmail(email: string) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1 LIMIT 1',
      [email]
    );
    return result.rows[0];
  }

  async create(data: any) {
    const result = await this.pool.query(
      'INSERT INTO users (username, email, password, role, full_name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [data.username, data.email, data.password, data.role, data.fullName]
    );
    return result.rows[0];
  }

  async update(id: number, data: any) {
    const result = await this.pool.query(
      'UPDATE users SET username = $1, email = $2, role = $3, full_name = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [data.username, data.email, data.role, data.fullName, id]
    );
    return result.rows[0];
  }

  async delete(id: number) {
    const result = await this.pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    return !!result.rows[0];
  }
}
