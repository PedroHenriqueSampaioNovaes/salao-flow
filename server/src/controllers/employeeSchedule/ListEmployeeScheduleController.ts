import { Request, Response } from 'express';

import { ListEmployeeScheduleService } from '@/src/services/employeeSchedule/ListEmployeeScheduleService.js';

export class ListEmployeeScheduleController {
  static async handle(req: Request, res: Response) {
    const barbershopId = Number(req.barbershopId);

    const listEmployeeScheduleService = new ListEmployeeScheduleService();

    const listEmployeeSchedule =
      await listEmployeeScheduleService.execute(barbershopId);

    return res.status(200).json(listEmployeeSchedule);
  }
}
