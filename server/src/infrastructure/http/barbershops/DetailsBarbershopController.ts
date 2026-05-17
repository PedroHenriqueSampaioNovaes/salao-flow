import { Request, Response } from 'express';

import { PrismaBarbershopAdapter } from '@/src/infrastructure/database/PrismaBarbershopAdapter.js';
import { DetailsBarbershopService } from '@/src/domain/services/barbershop/DetailsBarbershopService.js';

export class DetailsBarbershopController {
  static async handle(req: Request, res: Response) {
    const prismaBarbershopAdapter = new PrismaBarbershopAdapter();

    const getBarbershopService = new DetailsBarbershopService(
      prismaBarbershopAdapter,
    );

    const barbershop = await getBarbershopService.execute(
      Number(req.barbershopId),
    );

    return res.status(200).json(barbershop);
  }
}
