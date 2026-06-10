import { Request, Response } from 'express';

import { DeleteAppointmentService } from '@/src/services/appointment/DeleteAppointmentService.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteAppointmentController {
  static async handle(req: Request, res: Response) {
    const id = req.params.id as string;
    const barbershopId = Number(req.barbershopId);

    if (!id) {
      throw new AppError('ID do agendamento é obrigatório.', 400);
    }

    const deleteAppointmentService = new DeleteAppointmentService();

    await deleteAppointmentService.execute(id, barbershopId);

    return res
      .status(200)
      .json({ message: 'Agendamento deletado com sucesso.' });
  }
}
