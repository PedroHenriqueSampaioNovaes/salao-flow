import { Request, Response } from 'express';

import { updateServiceSchema } from '@sistema-barbearia/validators';

import { UpdateServiceItemService } from '../../services/service/UpdateServiceItemService.js';

export class UpdateServiceItemController {
  static async handle(req: Request, res: Response) {
    const body = updateServiceSchema.parse({ ...req.body, ...req.params });
    const barbershopId = Number(req.barbershopId);

    const updateServiceItemService = new UpdateServiceItemService();

    const service = await updateServiceItemService.execute(body, barbershopId);

    return res.status(200).json(service);
  }
}
