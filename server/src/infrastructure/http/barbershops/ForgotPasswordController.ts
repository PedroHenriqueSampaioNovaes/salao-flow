import { Request, Response } from 'express';

import { ForgotPasswordSchema } from '@sistema-barbearia/validators';

import { PrismaBarbershopAdapter } from '@/src/infrastructure/database/PrismaBarbershopAdapter.js';
import { NodemailerMailAdapter } from '@/src/infrastructure/Providers/NodemailerMailAdapter.js';
import { ForgotPasswordService } from '@/src/domain/services/barbershop/ForgotPasswordService.js';

export class ForgotPasswordController {
  static async handle(req: Request, res: Response) {
    const body = ForgotPasswordSchema.parse(req.body);

    const prismaBarbershopAdapter = new PrismaBarbershopAdapter();
    const nodemailerMailAdapter = new NodemailerMailAdapter();

    const forgotPasswordService = new ForgotPasswordService(
      prismaBarbershopAdapter,
      nodemailerMailAdapter,
    );

    const response = await forgotPasswordService.execute(body);

    return res.status(200).json(response);
  }
}
