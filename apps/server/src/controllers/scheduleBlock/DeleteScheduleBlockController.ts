import { Request, Response } from 'express';

import { DeleteScheduleBlockService } from '@/src/services/scheduleBlock/DeleteScheduleBlockService.js';
import { AppError } from '@/src/errors/AppError.js';

export class DeleteScheduleBlockController {
  static async handle(req: Request, res: Response) {
    const id = req.params.id as string;
    const barbershopId = Number(req.barbershopId);

    if (!id) {
      throw new AppError('ID do bloqueio de expediente não informado.', 400);
    }

    const deleteScheduleBlockService = new DeleteScheduleBlockService();

    await deleteScheduleBlockService.execute(id, barbershopId);

    return res
      .status(200)
      .json({ message: 'Bloqueio de expediente excluído com sucesso.' });
  }
}
