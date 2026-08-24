import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = process.env.DATABASE_URL || 
      `postgresql://${process.env.DB_USERNAME || 'nexa_user'}:${process.env.DB_PASSWORD || 'nexa_pass_123'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'nexa_db'}`;
    
    console.log('Connecting to database...');
    this.pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }

  async onModuleInit() {
    try {
      await this.pool.query('SELECT 1');
      console.log('Database connected successfully!');
      
      // Verify tables exist
      const result = await this.pool.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      `);
      console.log('Users table exists:', result.rows.length > 0);
    } catch (error) {
      console.error('Database connection failed:', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  getPool(): Pool {
    return this.pool;
  }
}
