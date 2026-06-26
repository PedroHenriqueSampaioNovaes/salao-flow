import { Request, Response } from 'express';
import { DeleteCustomerService } from '@/src/services/customer/DeleteCustomerService.js';

export class DeleteCustomerController {
  static async handle(req: Request, res: Response) {
    const customerId = Number(req.params.id);
    const barbershopId = Number(req.barbershopId);

    const deleteCustomerService = new DeleteCustomerService();
    await deleteCustomerService.execute(customerId, barbershopId);

    return res.status(200).json({ message: 'Cliente excluído com sucesso.' });
  }
}
