import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: any) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  findAll(@Query('start') start?: string, @Query('end') end?: string) {
    if (start && end) {
      return this.expensesService.findByDateRange(start, end);
    }
    return this.expensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.expensesService.findById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.expensesService.remove(id);
  }
}
