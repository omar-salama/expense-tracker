import { User } from '../../users/user.entity';
import { RegisterDto } from '../dto/register.dto';

export interface IUserLookupService {
  findOneByEmail(email: string): Promise<User | null>;
  findOneById(id: number): Promise<User | null>;
  create(user: RegisterDto): Promise<User>;
} 