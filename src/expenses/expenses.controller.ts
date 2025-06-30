import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  HttpCode,
} from '@nestjs/common';
import {
  ApiBody,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './expense.entity';
import { ExpensesService } from './expenses.service';
import { ApiMessage } from '../common/decorators/api-message.decorator';
import { ApiResponseDto } from '../common/api-response.dto';
import { ApiResponseWithData } from '../common/decorators/api-response-with-data.decorator';

@ApiExtraModels(ApiResponseDto, Expense)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiMessage('Expense created successfully')
  @ApiResponseWithData(Expense, 201)
  @ApiBody({ type: CreateExpenseDto })
  async create(@Body() createExpenseDto: CreateExpenseDto): Promise<Expense> {
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @ApiMessage('Expenses fetched successfully')
  @ApiResponseWithData([Expense], 200)
  findAll(): Promise<Expense[]> {
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiMessage('Expense fetched successfully')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponseWithData(Expense, 200)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Expense> {
    return this.expensesService.findOne(id);
  }

  @Put(':id')
  @ApiMessage('Expense updated successfully')
  @ApiParam({ name: 'id', type: Number })
  @ApiResponseWithData(Expense, 200)
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
  @ApiResponseWithData(Expense, 200)
  @HttpCode(200)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.expensesService.remove(id);
    return { message: 'Expense deleted successfully' };
  }
}
