import { Request, Response } from 'express';

import { DeleteServiceItemService } from '../../services/service/DeleteServiceItemService.js';

export class DeleteServiceItemController {
  static async handle(req: Request, res: Response) {
    const serviceId = req.params.id as string;
    const barbershopId = Number(req.barbershopId);

    const deleteServiceItemService = new DeleteServiceItemService();

    await deleteServiceItemService.execute(serviceId, barbershopId);

    return res.status(200).json({ message: 'Serviço deletado com sucesso!' });
  }
}
