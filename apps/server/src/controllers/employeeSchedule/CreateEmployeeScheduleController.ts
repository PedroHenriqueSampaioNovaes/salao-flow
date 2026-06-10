import { Request, Response } from 'express';

import { EmployeeScheduleSchema } from '@sistema-barbearia/validators';

import { CreateEmployeeScheduleService } from '../../services/employeeSchedule/CreateEmployeeScheduleService.js';

export class CreateEmployeeScheduleController {
  static async handle(req: Request, res: Response) {
    const body = EmployeeScheduleSchema.parse(req.body);
    const barbershopId = Number(req.barbershopId);

    const createEmployeeScheduleService = new CreateEmployeeScheduleService();

    const employeeSchedule = await createEmployeeScheduleService.execute(
      body,
      barbershopId,
    );

    return res.status(201).json(employeeSchedule);
  }
}
