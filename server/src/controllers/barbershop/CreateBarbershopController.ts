import { Request, Response } from 'express';

import { BarbershopSchema } from '@sistema-barbearia/validators';

import { CreateBarbershopService } from '@/src/services/barbershop/CreateBarbershopService.js';

export class CreateBarbershopController {
  static async handle(req: Request, res: Response) {
    const body = BarbershopSchema.parse(req.body);

    const createBarbershopService = new CreateBarbershopService();

    const barbershop = await createBarbershopService.execute(body);

    return res.status(201).json(barbershop);
  }
}
