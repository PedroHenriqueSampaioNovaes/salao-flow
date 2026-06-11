import { Request, Response } from 'express';

import { forgotPasswordSchema } from '@sistema-barbearia/validators';

import { ForgotPasswordService } from '../../services/barbershop/ForgotPasswordService.js';

export class ForgotPasswordController {
  static async handle(req: Request, res: Response) {
    const body = forgotPasswordSchema.parse(req.body);

    const forgotPasswordService = new ForgotPasswordService();

    const response = await forgotPasswordService.execute(body);

    return res.status(200).json(response);
  }
}
