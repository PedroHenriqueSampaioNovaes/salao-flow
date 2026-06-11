import { Request, Response } from 'express';

import { updateBarbershopSchema } from '@sistema-barbearia/validators';

import { UpdateBarbershopService } from '@/src/services/barbershop/UpdateBarbershopService.js';

export class UpdateBarbershopController {
  static async handle(req: Request, res: Response) {
    const body = updateBarbershopSchema.parse(req.body);

    const updateBarbershopService = new UpdateBarbershopService();

    const result = await updateBarbershopService.execute(
      Number(req.barbershopId),
      body,
    );

    return res.status(200).json(result);
  }
}
