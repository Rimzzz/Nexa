import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  create(@Body() createExpenseDto: any) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses with optional date range' })
  @ApiResponse({ status: 200, description: 'List of expenses retrieved' })
  findAll(@Query('start') start?: string, @Query('end') end?: string) {
    if (start && end) {
      return this.expensesService.findByDateRange(start, end);
    }
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  findOne(@Param('id') id: number) {
    return this.expensesService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  remove(@Param('id') id: number) {
    return this.expensesService.remove(id);
  }
}
