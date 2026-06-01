import { Request, Response } from 'express';

import { ListAppointmentService } from '@/src/services/appointment/ListAppointmentService.js';

import { ListAppointmentForMonth } from '@/src/interfaces/Appointment.js';

import { AppError } from '@/src/errors/AppError.js';

export class ListAppointmentController {
  static async handle(req: Request, res: Response) {
    const body = req.body as ListAppointmentForMonth;
    const barbershopId = Number(req.barbershopId);

    if (!body.date) throw new AppError('Data inválida.', 400);

    const date = new Date(body.date);

    const listAppointmentService = new ListAppointmentService();

    const appointments = await listAppointmentService.execute(
      { date },
      barbershopId,
    );

    return res.status(200).json(appointments);
  }
}
