import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { instanceToPlain } from 'class-transformer';
import { IUserLookupService } from '../auth/interfaces/user-lookup.interface';

@Injectable()
export class UsersService implements IUserLookupService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const user = this.userRepository.create(createUserDto);
    user.password = await bcrypt.hash(user.password, 10);
    const savedUser = await this.userRepository.save(user);
    return instanceToPlain(savedUser);
  }

  async findOneById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;
    return user;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<any> {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Current password is incorrect');
    }
    user.password = await bcrypt.hash(dto.newPassword, 10);
    const updatedUser = await this.userRepository.save(user);
    return instanceToPlain(updatedUser);
  }
}
