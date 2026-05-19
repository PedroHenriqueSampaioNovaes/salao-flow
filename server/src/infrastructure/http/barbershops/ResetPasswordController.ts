import { Request, Response } from 'express';

import { ResetPasswordSchema } from '@sistema-barbearia/validators';

import { PrismaBarbershopAdapter } from '@/src/infrastructure/database/PrismaBarbershopAdapter.js';
import { BcryptHashAdapter } from '@/src/infrastructure/Providers/BcryptHashAdapter.js';
import { ResetPasswordService } from '@/src/domain/services/barbershop/ResetPasswordService.js';

export class ResetPasswordController {
  static async handle(req: Request, res: Response) {
    const body = ResetPasswordSchema.parse(req.body);

    const prismaBarbershopAdapter = new PrismaBarbershopAdapter();
    const bcryptHashAdapter = new BcryptHashAdapter();

    const resetPasswordService = new ResetPasswordService(
      prismaBarbershopAdapter,
      bcryptHashAdapter,
    );

    await resetPasswordService.execute(body);

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  }
}
