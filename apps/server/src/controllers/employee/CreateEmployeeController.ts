import { Request, Response } from 'express';

import { employeeSchema } from '@sistema-barbearia/validators';

import { CreateEmployeeService } from '@/src/services/employee/CreateEmployeeService.js';

export class CreateEmployeeController {
  static async handle(req: Request, res: Response) {
    const body = employeeSchema.parse(req.body);
    const barbershopId = Number(req.barbershopId);

    const createEmployeeService = new CreateEmployeeService();

    const employee = await createEmployeeService.execute(body, barbershopId);

    return res.status(201).json(employee);
  }
}
