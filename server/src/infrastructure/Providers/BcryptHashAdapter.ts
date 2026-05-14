import bcrypt from 'bcryptjs';

import { HashRepository } from '@/src/domain/repositories/HashRepository.js';

export class BcryptHashAdapter implements HashRepository {
  async hash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
