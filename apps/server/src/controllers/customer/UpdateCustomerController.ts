import { Request, Response } from 'express';
import { updateCustomerSchema } from '@sistema-barbearia/validators';
import { UpdateCustomerService } from '@/src/services/customer/UpdateCustomerService.js';

export class UpdateCustomerController {
  static async handle(req: Request, res: Response) {
    const body = updateCustomerSchema.parse({ ...req.body, ...req.params });
    const barbershopId = Number(req.barbershopId);

    const updateCustomerService = new UpdateCustomerService();
    const customer = await updateCustomerService.execute(body, barbershopId);

    return res.status(200).json(customer);
  }
}
