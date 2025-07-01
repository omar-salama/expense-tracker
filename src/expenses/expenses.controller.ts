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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiExtraModels, ApiParam } from '@nestjs/swagger';
import { ApiPaginatedResponseDto } from '../common/api-paginated-response.dto';
import { ApiResponseDto } from '../common/api-response.dto';
import { ApiMessage } from '../common/decorators/api-message.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { PaginatedData } from '../common/paginated-data.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './expense.entity';
import { ExpensesService } from './expenses.service';
import { RequestUser } from '../auth/decorators/request-user.decorator';
import { RequestUserDto } from '../auth/dto/request-user.dto';

@ApiExtraModels(ApiResponseDto, ApiPaginatedResponseDto, Expense)
@UseGuards(AuthGuard('jwt'))
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiMessage('Expense created successfully')
  @ApiSuccessResponse(Expense)
  @ApiBody({ type: CreateExpenseDto })
  create(
    @RequestUser() user: RequestUserDto,
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.create(createExpenseDto, user.id);
  }

  @Get()
  @ApiMessage('Expenses fetched successfully')
  @ApiSuccessResponse([Expense], 200, { withMetaData: true })
  findAllPaginated(
    @RequestUser() user: RequestUserDto,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedData<Expense[]>> {
    return this.expensesService.findAllPaginated(paginationQuery, user.id);
  }

  @Get(':id')
  @ApiMessage('Expense fetched successfully')
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(Expense, 200)
  findOne(
    @RequestUser() user: RequestUserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Expense> {
    return this.expensesService.findOneById(id, user.id);
  }

  @Put(':id')
  @ApiMessage('Expense updated successfully')
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(Expense, 200)
  @ApiBody({ type: UpdateExpenseDto })
  update(
    @RequestUser() user: RequestUserDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.updateOneById(id, user.id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiMessage('Expense deleted successfully')
  @ApiParam({ name: 'id', type: Number })
  @ApiSuccessResponse(Expense, 200)
  @HttpCode(200)
  remove(
    @RequestUser() user: RequestUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.expensesService.removeOneById(id, user.id);
  }
}
