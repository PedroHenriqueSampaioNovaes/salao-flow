import { Request, Response } from 'express';

import { UserSchema } from '@sistema-barbearia/validators';

import { PrismaUserAdapter } from '@/src/infrastructure/database/PrismaUserAdapter.js';
import { BcryptHashAdapter } from '@/src/infrastructure/Providers/BcryptHashAdapter.js';
import { CreateUserService } from '@/src/domain/services/users/CreateUserService.js';

export class CreateUserController {
  static async handle(req: Request, res: Response) {
    const body = UserSchema.parse(req.body);

    const prismaUserAdapter = new PrismaUserAdapter();
    const bcryptHashAdapter = new BcryptHashAdapter();

    const createUserService = new CreateUserService(
      prismaUserAdapter,
      bcryptHashAdapter,
    );

    const user = await createUserService.execute(body);

    return res.status(201).json(user);
  }
}
