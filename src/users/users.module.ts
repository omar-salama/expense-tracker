import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { IUserLookupService } from '../auth/interfaces/user-lookup.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    { provide: 'IUserLookupService', useExisting: UsersService },
  ],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule, 'IUserLookupService'],
})
export class UsersModule {} 