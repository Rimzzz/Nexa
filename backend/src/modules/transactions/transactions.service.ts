import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from '../../repositories/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionsRepository: TransactionsRepository,
  ) {}

  async create(createTransactionDto: any): Promise<any> {
    const { items, ...transactionData } = createTransactionDto;

    const transaction = await this.transactionsRepository.createTransaction(transactionData);

    if (items && items.length > 0) {
      const transactionItems = items.map((item: any) => ({
        transactionId: transaction.id,
        itemName: item.itemName,
        quantity: item.quantity || 1,
        price: item.price,
        subtotal: item.subtotal || (item.quantity * item.price),
      }));
      await this.transactionsRepository.createTransactionItems(transactionItems);
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
