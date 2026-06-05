import { Request, Response } from 'express';

import { DetailsScheduleBlockService } from '@/src/services/scheduleBlock/DetailsScheduleBlockService.js';

import { AppError } from '@/src/errors/AppError.js';

export class DetailsScheduleBlockController {
  static async handle(req: Request, res: Response) {
    const id = req.params.id as string;
    const barbershopId = Number(req.barbershopId);

    if (!id) {
      throw new AppError('ID do bloqueio de expediente não informado.', 400);
    }

    const detailsScheduleBlockService = new DetailsScheduleBlockService();

    const scheduleBlock = await detailsScheduleBlockService.execute(
      id,
      barbershopId,
    );

    return res.status(200).json(scheduleBlock);
  }
}
