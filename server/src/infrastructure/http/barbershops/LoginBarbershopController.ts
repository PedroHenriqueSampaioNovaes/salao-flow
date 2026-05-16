import { Request, Response } from 'express';

import { LoginSchema } from '@sistema-barbearia/validators';

import { PrismaBarbershopAdapter } from '@/src/infrastructure/database/PrismaBarbershopAdapter.js';
import { BcryptHashAdapter } from '@/src/infrastructure/Providers/BcryptHashAdapter.js';
import { JwtTokenAdapter } from '@/src/infrastructure/Providers/JwtTokenAdapter.js';
import { LoginBarbershopService } from '@/src/domain/services/barbershop/LoginBarbershopService.js';

export class LoginBarbershopController {
  static async handle(req: Request, res: Response) {
    const body = LoginSchema.parse(req.body);

    const prismaBarbershopAdapter = new PrismaBarbershopAdapter();
    const bcryptHashAdapter = new BcryptHashAdapter();
    const jwtTokenAdapter = new JwtTokenAdapter();

    const loginBarbershopService = new LoginBarbershopService(
      prismaBarbershopAdapter,
      bcryptHashAdapter,
      jwtTokenAdapter,
    );

    const response = await loginBarbershopService.execute(body);

    return res.status(200).json(response);
  }
}
