import { Request, Response } from 'express';

import { ListCustomerService } from '@/src/services/customer/ListCustomerService.js';

export class ListCustomerController {
  static async handle(req: Request, res: Response) {
    const barbershopId = Number(req.barbershopId);

    const listCustomerService = new ListCustomerService();

    const customers = await listCustomerService.execute(barbershopId);

    return res.status(200).json(customers);
  }
}
