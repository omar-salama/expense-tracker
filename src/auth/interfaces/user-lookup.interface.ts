import { User } from '../../users/user.entity';

export interface IUserLookupService {
  findOneByEmail(email: string): Promise<User | null>;
  findOneById(id: number): Promise<User | null>;
} 