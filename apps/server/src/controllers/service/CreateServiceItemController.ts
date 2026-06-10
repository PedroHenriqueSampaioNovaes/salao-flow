import { Request, Response } from 'express';

import { ServiceSchema } from '@sistema-barbearia/validators';

import { CreateServiceItemService } from '../../services/service/CreateServiceItemService.js';

export class CreateServiceItemController {
  static async handle(req: Request, res: Response) {
    const body = ServiceSchema.parse(req.body);
    const barbershopId = Number(req.barbershopId);

    const createEmployeeService = new CreateServiceItemService();

    const service = await createEmployeeService.execute(body, barbershopId);

    return res.status(201).json(service);
  }
}
