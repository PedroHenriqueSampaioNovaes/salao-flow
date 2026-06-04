import { Request, Response } from 'express';

import { ListServiceItemService } from '../../services/service/ListServiceItemService.js';

export class ListServiceItemController {
  static async handle(req: Request, res: Response) {
    const barbershopId = Number(req.barbershopId);

    const listServiceItemService = new ListServiceItemService();

    const services = await listServiceItemService.execute(barbershopId);

    return res.status(200).json(services);
  }
}
