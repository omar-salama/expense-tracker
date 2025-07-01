import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    { provide: 'IUserLookupService', useExisting: UsersService },
  ],
  controllers: [],
  exports: [UsersService, TypeOrmModule, 'IUserLookupService'],
})
export class UsersModule {} 