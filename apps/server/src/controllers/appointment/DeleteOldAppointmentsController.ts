import { Request, Response } from 'express';

import { DeleteOldAppointmentsService } from '@/src/services/appointment/DeleteOldAppointmentsService.js';

export class DeleteOldAppointmentsController {
  static async handle(_req: Request, res: Response) {
    const deleteOldAppointmentsService = new DeleteOldAppointmentsService();

    const { deletedCount } = await deleteOldAppointmentsService.execute();

    return res.status(200).json({
      message: 'Agendamentos antigos removidos com sucesso.',
      deletedCount,
    });
  }
}
