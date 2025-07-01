import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiParam } from '@nestjs/swagger';
import { ApiResponseDto } from '../common/api-response.dto';
import { ApiMessage } from '../common/decorators/api-message.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { PaginatedData } from '../common/paginated-data.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './expense.entity';
import { ExpensesService } from './expenses.service';

@ApiExtraModels(ApiResponseDto, Expense)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiMessage('Expense created successfully')
  @ApiSuccessResponse(Expense)
  @ApiBody({ type: CreateExpenseDto })
  async create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiMessage('Expenses fetched successfully')
  @ApiSuccessResponse([Expense], 200, { withMetaData: true })
  findAllPaginated(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedData<Expense[]>> {
    return this.expensesService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiMessage('Expense fetched successfully')
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(Expense, 200)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Expense> {
    return this.expensesService.findOne(id);
  }

  @Put(':id')
  @ApiMessage('Expense updated successfully')
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(Expense, 200)
  @ApiBody({ type: UpdateExpenseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiMessage('Expense deleted successfully')
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(Expense, 200)
  @HttpCode(200)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.expensesService.remove(id);
    return { message: 'Expense deleted successfully' };
  }
}
