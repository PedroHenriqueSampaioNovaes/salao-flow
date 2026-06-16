import { Request, Response } from 'express';

import { ListAppointmentService } from '@/src/services/appointment/ListAppointmentService.js';

import { AppError } from '@/src/errors/AppError.js';

export class ListAppointmentController {
  static async handle(req: Request, res: Response) {
    const { date } = req.query as { date: string };
    const barbershopId = Number(req.barbershopId);

    if (!date) throw new AppError('Data inválida.', 400);

    const dateParsed = new Date(date);

    const listAppointmentService = new ListAppointmentService();

    const appointments = await listAppointmentService.execute(
      dateParsed,
      barbershopId,
    );

    return res.status(200).json(appointments);
  }
}
