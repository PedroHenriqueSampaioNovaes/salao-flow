import jwt from 'jsonwebtoken';

import { StringValue } from 'ms';

import { TokenRepository } from '@/src/domain/repositories/TokenRepository.js';

export class JwtTokenAdapter implements TokenRepository {
  private secret: string;

  constructor() {
    if (process.env.JWT_SECRET) {
      this.secret = process.env.JWT_SECRET;
    } else {
      throw new Error('JWT_SECRET não foi definido');
    }
  }

  sign(payload: string | object | Buffer, expiresIn: StringValue): string {
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify(token: string): string | object {
    return jwt.verify(token, this.secret);
  }
}
