import { Request, Response } from 'express';

import { DetailsEmployeeScheduleService } from '@/src/services/employeeSchedule/DetailsEmployeeScheduleService.js';

import { AppError } from '@/src/errors/AppError.js';

export class DetailsEmployeeScheduleController {
  static async handle(req: Request, res: Response) {
    const id = req.params.id as string;
    const barbershopId = Number(req.barbershopId);

    if (!id) {
      throw new AppError('ID do expediente não informado.', 400);
    }

    const detailsEmployeeScheduleService = new DetailsEmployeeScheduleService();

    const employeeSchedule = await detailsEmployeeScheduleService.execute(
      id,
      barbershopId,
    );

    return res.status(200).json(employeeSchedule);
  }
}
