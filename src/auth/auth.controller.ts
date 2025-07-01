import {
  Body,
  Controller,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { ApiMessage } from '../common/decorators/api-message.decorator';
import { ApiSuccessResponse } from '../common/decorators/api-success-response.decorator';
import { AuthService } from './auth.service';
import { RequestUser } from './decorators/request-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestUserDto } from './dto/request-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiSuccessResponse(String, 200)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiSuccessResponse(String, 201)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiMessage('Password changed successfully')
  @ApiSuccessResponse(undefined, 200)
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @RequestUser() user: RequestUserDto,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(user.id, dto);
  }
}
