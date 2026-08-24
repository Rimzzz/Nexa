import { pgTable, text, numeric, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['cashier', 'admin']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'card', 'qr', 'other']);
export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense']);

// Tables - using snake_case column names to match DB
export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: userRoleEnum('role').default('cashier').notNull(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  type: categoryTypeEnum('type').default('expense').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const items = pgTable('items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  stock: integer('stock').default(0).notNull(),
  category: text('category'),
  barcode: text('barcode'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  transactionDate: timestamp('transaction_date').defaultNow().notNull(),
  subtotal: numeric('subtotal', { precision: 15, scale: 2 }).default('0').notNull(),
  tax: numeric('tax', { precision: 15, scale: 2 }).default('0').notNull(),
  discount: numeric('discount', { precision: 15, scale: 2 }).default('0').notNull(),
  total: numeric('total', { precision: 15, scale: 2 }).default('0').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').default('cash').notNull(),
  notes: text('notes'),
  cashierId: integer('cashier_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactionItems = pgTable('transaction_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  itemName: text('item_name').notNull(),
  quantity: integer('quantity').default(1).notNull(),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  transactionId: integer('transaction_id').references(() => transactions.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const expenses = pgTable('expenses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  expenseDate: timestamp('expense_date').defaultNow().notNull(),
  description: text('description').notNull(),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  categoryId: integer('category_id'),
  category: text('category'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;

export type TransactionItem = typeof transactionItems.$inferSelect;
export type NewTransactionItem = typeof transactionItems.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
