import { User } from '../entities/User.js';

import { CreateUserRequest } from '@/src/types/CreateUserRequest.js';

export interface UserRepository {
  create(user: CreateUserRequest): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
