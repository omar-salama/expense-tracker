import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiParam } from '@nestjs/swagger';
import { ApiPaginatedResponseDto } from '../common/api-paginated-response.dto';
import { ApiResponseDto } from '../common/api-response.dto';
import { ApiMessage } from '../common/decorators/api-message.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiExtraModels(ApiResponseDto, ApiPaginatedResponseDto, User)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiSuccessResponse(User, 201)
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id/change-password')
  @ApiMessage('Password changed successfully')
  @ApiSuccessResponse(undefined, 200)
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: ChangePasswordDto })
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    this.usersService.changePassword(id, dto);
  }
}
