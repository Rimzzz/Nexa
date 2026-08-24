import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpensesRepository } from '../../repositories/expenses.repository';
import { type NewExpense } from '../../db/schema';

@Injectable()
export class ExpensesService {
  constructor(
    private expensesRepository: ExpensesRepository,
  ) {}

  async create(createExpenseDto: any): Promise<any> {
    const newExpense: NewExpense = {
      ...createExpenseDto,
      amount: createExpenseDto.amount.toString(),
    };
    return this.expensesRepository.create(newExpense);
  }

  async findAll(): Promise<any[]> {
    return this.expensesRepository.findAll();
  }

  async findById(id: number): Promise<any> {
    const expense = await this.expensesRepository.findById(id);
    
    if (!expense) {
      throw new NotFoundException(`Pengeluaran dengan ID ${id} tidak ditemukan`);
    }
    
    return expense;
  }

  async findByDateRange(startDate: string, endDate: string): Promise<any[]> {
    return this.expensesRepository.findByDateRange(new Date(startDate), new Date(endDate));
  }

  async remove(id: number): Promise<void> {
    const exists = await this.expensesRepository.delete(id);
    if (!exists) {
      throw new NotFoundException(`Pengeluaran dengan ID ${id} tidak ditemukan`);
    }
  }
}
