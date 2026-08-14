import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { ItemsModule } from './modules/items/items.module';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionItem } from './entities/transaction-item.entity';
import { Expense } from './entities/expense.entity';
import { Item } from './entities/item.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'nexa_user',
        password: process.env.DB_PASSWORD || 'nexa_pass_123',
        database: process.env.DB_NAME || 'nexa_db',
        entities: [User, Transaction, TransactionItem, Expense, Item, Category],
        synchronize: process.env.NODE_ENV === 'development',
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
    AuthModule,
    TransactionsModule,
    ExpensesModule,
    ItemsModule,
  ],
})
export class AppModule {}
