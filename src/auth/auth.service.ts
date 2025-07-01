import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { IUserLookupService } from './interfaces/user-lookup.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserLookupService')
    private readonly usersService: IUserLookupService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    return user;
  }

  async login(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.usersService.findOneByEmail(registerDto.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return this.login(user);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new BadRequestException('User not found');
    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch)
      throw new BadRequestException('Current password is incorrect');
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await (this.usersService as any).userRepository.save(user);
  }
}
