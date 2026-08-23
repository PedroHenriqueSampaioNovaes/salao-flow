import { Request, Response } from 'express';

import { ListAppointmentService } from '@/src/services/appointment/ListAppointmentService.js';

export class ListAppointmentController {
  static async handle(req: Request, res: Response) {
    const { date } = req.query as { date: string };
    const barbershopId = Number(req.barbershopId);

    const listAppointmentService = new ListAppointmentService();

    const appointments = await listAppointmentService.execute(
      date,
      barbershopId,
    );

    return res.status(200).json(appointments);
  }
}
