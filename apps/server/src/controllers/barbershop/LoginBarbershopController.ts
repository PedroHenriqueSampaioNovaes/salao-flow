import { Request, Response } from 'express';

import { loginSchema } from '@sistema-barbearia/validators';

import { LoginBarbershopService } from '../../services/barbershop/LoginBarbershopService.js';

export class LoginBarbershopController {
  static async handle(req: Request, res: Response) {
    const body = loginSchema.parse(req.body);

    const loginBarbershopService = new LoginBarbershopService();

    const response = await loginBarbershopService.execute(body);

    return res.status(200).json(response);
  }
}
