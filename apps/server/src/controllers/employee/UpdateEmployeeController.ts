import { Request, Response } from 'express';

import { updateEmployeeSchema } from '@sistema-barbearia/validators';

import { UpdateEmployeeService } from '@/src/services/employee/UpdateEmployeeService.js';

export class UpdateEmployeeController {
  static async handle(req: Request, res: Response) {
    const body = updateEmployeeSchema.parse({ ...req.body, ...req.params });
    const barbershopId = Number(req.barbershopId);

    const updateEmployeeService = new UpdateEmployeeService();

    const employee = await updateEmployeeService.execute(body, barbershopId);

    return res.status(200).json(employee);
  }
}
