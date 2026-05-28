import { Request, Response } from 'express';

import { UpdateEmployeeSchema } from '@sistema-barbearia/validators';

import { UpdateEmployeeService } from '@/src/services/employee/UpdateEmployeeService.js';

export class UpdateEmployeeController {
  static async handle(req: Request, res: Response) {
    const body = UpdateEmployeeSchema.parse({ ...req.body, ...req.params });
    const barbershopId = Number(req.barbershopId);

    const updateEmployeeService = new UpdateEmployeeService();

    const employee = await updateEmployeeService.execute(body, barbershopId);

    return res.status(201).json(employee);
  }
}
