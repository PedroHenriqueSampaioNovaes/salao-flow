import { Request, Response } from 'express';

import { ListScheduleBlockService } from '@/src/services/scheduleBlock/ListScheduleBlockService.js';

export class ListScheduleBlockController {
  static async handle(req: Request, res: Response) {
    const barbershopId = Number(req.barbershopId);

    const listScheduleBlockService = new ListScheduleBlockService();

    const scheduleBlocks = await listScheduleBlockService.execute(barbershopId);

    return res.status(200).json(scheduleBlocks);
  }
}
