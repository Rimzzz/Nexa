import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

let pool: Pool | null = null;

export function getDatabase() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 
      `postgresql://${process.env.DB_USERNAME || 'nexa_user'}:${process.env.DB_PASSWORD || 'nexa_pass_123'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'nexa_db'}`;
    
    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  
  return drizzle(pool, { schema });
}

// Export types
export { type User, type NewUser, type Transaction, type NewTransaction, type TransactionItem, type NewTransactionItem, type Expense, type NewExpense, type Item, type NewItem, type Category, type NewCategory } from './schema';
export { users, transactions, transactionItems, expenses, items, categories } from './schema';
