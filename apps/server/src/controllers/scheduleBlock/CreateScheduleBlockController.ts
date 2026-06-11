import { Request, Response } from 'express';

import { createScheduleBlockSchema } from '@sistema-barbearia/validators';

import { CreateScheduleBlockService } from '../../services/scheduleBlock/CreateScheduleBlockService.js';

export class CreateScheduleBlockController {
  static async handle(req: Request, res: Response) {
    const body = createScheduleBlockSchema.parse(req.body);
    const barbershopId = Number(req.barbershopId);

    const createScheduleBlockService = new CreateScheduleBlockService();

    const scheduleBlock = await createScheduleBlockService.execute(
      body,
      barbershopId,
    );

    return res.status(201).json(scheduleBlock);
  }
}
