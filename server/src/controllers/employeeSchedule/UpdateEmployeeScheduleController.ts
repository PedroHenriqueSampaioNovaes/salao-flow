import { Request, Response } from 'express';

import { UpdateEmployeeScheduleSchema } from '@sistema-barbearia/validators';

import { UpdateEmployeeScheduleService } from '../../services/employeeSchedule/UpdateEmployeeScheduleService.js';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateEmployeeScheduleController {
  static async handle(req: Request, res: Response) {
    const body = UpdateEmployeeScheduleSchema.parse(req.body);
    const id = req.params.id as string;
    const barbershopId = Number(req.barbershopId);

    if (!id) {
      throw new AppError('ID do expediente não informado.', 400);
    }

    const updateEmployeeScheduleService = new UpdateEmployeeScheduleService();

    const employeeSchedule = await updateEmployeeScheduleService.execute(
      body,
      barbershopId,
      id,
    );

    return res.status(200).json(employeeSchedule);
  }
}
