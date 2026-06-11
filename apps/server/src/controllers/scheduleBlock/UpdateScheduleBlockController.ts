import { Request, Response } from 'express';

import { updateScheduleBlockSchema } from '@sistema-barbearia/validators';

import { UpdateScheduleBlockService } from '../../services/scheduleBlock/UpdateScheduleBlockService.js';

export class UpdateScheduleBlockController {
  static async handle(req: Request, res: Response) {
    const body = updateScheduleBlockSchema.parse(req.body);
    const scheduleBlockId = req.params.id as string;
    const barbershopId = Number(req.barbershopId);

    const updateScheduleBlockService = new UpdateScheduleBlockService();

    const scheduleBlock = await updateScheduleBlockService.execute(
      scheduleBlockId,
      body,
      barbershopId,
    );

    return res.status(200).json(scheduleBlock);
  }
}
