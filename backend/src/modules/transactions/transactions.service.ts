import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from '../../repositories/transactions.repository';
import { type NewTransaction, type NewTransactionItem } from '../../db/schema';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionsRepository: TransactionsRepository,
  ) {}

  async create(createTransactionDto: any): Promise<any> {
    const { items, ...transactionData } = createTransactionDto;

    const newTransaction: NewTransaction = {
      ...transactionData,
      subtotal: transactionData.subtotal || '0',
      tax: transactionData.tax || '0',
      discount: transactionData.discount || '0',
      total: transactionData.total || '0',
    };

    const transaction = await this.transactionsRepository.create(newTransaction);

    if (items && items.length > 0) {
      const transactionItems: NewTransactionItem[] = items.map((item: any) => ({
        itemName: item.itemName,
        quantity: item.quantity || 1,
        price: item.price.toString(),
        subtotal: item.subtotal || (item.quantity * item.price).toString(),
        transactionId: transaction.id,
      }));
      await this.transactionsRepository.createItems(transactionItems);
    }

    return transaction;
  }

  async findAll(): Promise<any[]> {
    return this.transactionsRepository.findAll();
  }

  async findById(id: number): Promise<any> {
    const transaction = await this.transactionsRepository.findById(id);
    
    if (!transaction) {
      throw new NotFoundException(`Transaksi dengan ID ${id} tidak ditemukan`);
    }

    return transaction;
  }

  async findByDateRange(startDate: string, endDate: string): Promise<any[]> {
    return this.transactionsRepository.findByDateRange(new Date(startDate), new Date(endDate));
  }

  async remove(id: number): Promise<void> {
    const exists = await this.transactionsRepository.delete(id);
    if (!exists) {
      throw new NotFoundException(`Transaksi dengan ID ${id} tidak ditemukan`);
    }
  }
}
