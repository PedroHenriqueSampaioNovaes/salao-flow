import { Request, Response } from 'express';

import { ResetPasswordSchema } from '@sistema-barbearia/validators';

import { ResetPasswordService } from '@/src/services/barbershop/ResetPasswordService.js';

export class ResetPasswordController {
  static async handle(req: Request, res: Response) {
    const body = ResetPasswordSchema.parse(req.body);

    const resetPasswordService = new ResetPasswordService();

    await resetPasswordService.execute(body);

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  }
}
