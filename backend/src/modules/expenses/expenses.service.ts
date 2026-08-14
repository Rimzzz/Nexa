import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from '../../entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: any): Promise<any> {
    const expense = this.expensesRepository.create(createExpenseDto);
    return this.expensesRepository.save(expense);
  }

  async findAll(): Promise<any[]> {
    return this.expensesRepository.find({
      order: { expenseDate: 'DESC' },
    });
  }

  async findById(id: number): Promise<any> {
    const expense = await this.expensesRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Pengeluaran dengan ID ${id} tidak ditemukan`);
    }
    return expense;
  }

  async findByDateRange(startDate: string, endDate: string): Promise<any[]> {
    return this.expensesRepository.find({
      where: {
        expenseDate: Between(new Date(startDate), new Date(endDate)),
      },
      order: { expenseDate: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    const expense = await this.findById(id);
    await this.expensesRepository.remove(expense);
  }
}
