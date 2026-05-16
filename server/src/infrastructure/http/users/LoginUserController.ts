import { Request, Response } from 'express';

import { LoginSchema } from '@sistema-barbearia/validators';

import { PrismaUserAdapter } from '@/src/infrastructure/database/PrismaUserAdapter.js';
import { BcryptHashAdapter } from '@/src/infrastructure/Providers/BcryptHashAdapter.js';
import { JwtTokenAdapter } from '@/src/infrastructure/Providers/JwtTokenAdapter.js';
import { LoginUserService } from '@/src/domain/services/users/LoginUserService.js';

export class LoginUserController {
  static async handle(req: Request, res: Response) {
    const body = LoginSchema.parse(req.body);

    const prismaUserAdapter = new PrismaUserAdapter();
    const bcryptHashAdapter = new BcryptHashAdapter();
    const jwtTokenAdapter = new JwtTokenAdapter();

    const loginUserService = new LoginUserService(
      prismaUserAdapter,
      bcryptHashAdapter,
      jwtTokenAdapter,
    );

    const response = await loginUserService.execute(body);

    return res.status(200).json(response);
  }
}
