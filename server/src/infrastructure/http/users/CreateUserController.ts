import { Request, Response } from 'express';

import { UserSchema, EmployeeSchema, z } from '@sistema-barbearia/validators';

const CreateUserWithEmployeesSchema = UserSchema.and(
  z.object({
    employees: z.array(EmployeeSchema, 'Adicione pelo menos 1 profissional.'),
  }),
);

import { PrismaUserAdapter } from '@/src/infrastructure/database/PrismaUserAdapter.js';
import { BcryptHashAdapter } from '@/src/infrastructure/Providers/BcryptHashAdapter.js';
import { CreateUserService } from '@/src/domain/services/users/CreateUserService.js';

export class CreateUserController {
  static async handle(req: Request, res: Response) {
    const body = CreateUserWithEmployeesSchema.parse(req.body);

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
