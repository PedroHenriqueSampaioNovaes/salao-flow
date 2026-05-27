import { Request, Response } from 'express';

import { DetailsBarbershopService } from '@/src/services/barbershop/DetailsBarbershopController.js';

export class DetailsBarbershopController {
  static async handle(req: Request, res: Response) {
    const getBarbershopService = new DetailsBarbershopService();

    const barbershop = await getBarbershopService.execute(
      Number(req.barbershopId),
    );

    return res.status(200).json(barbershop);
  }
}
