import { Request, Response } from 'express';

import { DeleteEmployeeScheduleService } from '@/src/services/employeeSchedule/DeleteEmployeeScheduleService.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteEmployeeScheduleController {
  static async handle(req: Request, res: Response) {
    const employeeScheduleId = req.params.id as string;
    const barbershopId = req.barbershopId;

    const deleteEmployeeScheduleService = new DeleteEmployeeScheduleService();

    if (!employeeScheduleId) {
      throw new AppError('ID do expediente não informado.', 400);
    }

    await deleteEmployeeScheduleService.execute(
      Number(barbershopId),
      employeeScheduleId,
    );

    return res
      .status(200)
      .json({ message: 'Expediente excluído com sucesso.' });
  }
}
