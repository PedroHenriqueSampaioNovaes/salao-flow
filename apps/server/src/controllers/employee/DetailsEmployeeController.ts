import { Request, Response } from 'express';

import { detailsEmployeeSchema } from '@sistema-barbearia/validators';

import { DetailsEmployeeService } from '@/src/services/employee/DetailsEmployeeService.js';

export class DetailsEmployeeController {
  static async handle(req: Request, res: Response) {
    const body = detailsEmployeeSchema.parse({ ...req.params });
    const barbershopId = Number(req.barbershopId);

    const detailsEmployeeService = new DetailsEmployeeService();

    const employee = await detailsEmployeeService.execute(body, barbershopId);

    return res.status(200).json(employee);
  }
}
