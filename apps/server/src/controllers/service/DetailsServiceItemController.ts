import { Request, Response } from 'express';

import { DetailsServiceItemService } from '../../services/service/DetailsServiceItemService.js';

export class DetailsServiceItemController {
  static async handle(req: Request, res: Response) {
    const barbershopId = Number(req.barbershopId);
    const id = req.params.id as string;

    const detailsServiceItemService = new DetailsServiceItemService();

    const service = await detailsServiceItemService.execute(id, barbershopId);

    return res.status(200).json(service);
  }
}
