import { Request, Response } from 'express';

import { createCustomerSchema } from '@sistema-barbearia/validators';

import { CreateCustomerService } from '@/src/services/customer/CreateCustomerService.js';

export class CreateCustomerController {
  static async handle(req: Request, res: Response) {
    const body = createCustomerSchema.parse(req.body);
    const barbershopId = Number(req.barbershopId);

    const createCustomerService = new CreateCustomerService();
    const customer = await createCustomerService.execute(body, barbershopId);

    return res.status(201).json(customer);
  }
}
