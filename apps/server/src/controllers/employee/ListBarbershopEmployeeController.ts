import { Request, Response } from 'express';

import { ListBarbershopEmployeeService } from '@/src/services/employee/ListBarbershopEmployeeService.js';

export class ListBarbershopEmployeeController {
  static async handle(req: Request, res: Response) {
    const barbershopId = Number(req.barbershopId);

    const listBarbershopEmployeeService = new ListBarbershopEmployeeService();

    const employees = await listBarbershopEmployeeService.execute(barbershopId);

    return res.status(200).json(employees);
  }
}
