import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from '../../entities/transaction.entity';
import { TransactionItem } from '../../entities/transaction-item.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: any,
    @InjectRepository(TransactionItem)
    private transactionItemsRepository: any,
  ) {}

  async create(createTransactionDto: any): Promise<any> {
    const { items, ...transactionData } = createTransactionDto;

    const transaction = await this.transactionsRepository.save({
      ...transactionData,
      subtotal: transactionData.subtotal || 0,
      tax: transactionData.tax || 0,
      discount: transactionData.discount || 0,
      total: transactionData.total || 0,
    });

    if (items && items.length > 0) {
      const transactionItems = items.map((item: any) => ({
        ...item,
        transactionId: transaction.id,
        subtotal: item.quantity * item.price,
      }));
      await this.transactionItemsRepository.save(transactionItems);
    }

    return transaction;
  }

  async findAll(): Promise<any[]> {
    return this.transactionsRepository.find({
      relations: ['cashier', 'items'],
      order: { transactionDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<any> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id },
      relations: ['cashier', 'items'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaksi dengan ID ${id} tidak ditemukan`);
    }

    return transaction;
  }

  async findByDateRange(startDate: string, endDate: string): Promise<any[]> {
    return this.transactionsRepository.find({
      where: {
        transactionDate: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['cashier', 'items'],
      order: { transactionDate: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.findById(id);
    await this.transactionsRepository.remove(transaction);
  }
}
