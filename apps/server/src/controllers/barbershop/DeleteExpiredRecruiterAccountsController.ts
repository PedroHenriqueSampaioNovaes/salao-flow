import { Request, Response } from 'express';

import { DeleteExpiredRecruiterAccountsService } from '@/src/services/barbershop/DeleteExpiredRecruiterAccountsService.js';

export class DeleteExpiredRecruiterAccountsController {
  static async handle(_req: Request, res: Response) {
    const deleteExpiredRecruiterAccountsService =
      new DeleteExpiredRecruiterAccountsService();

    const { deletedCount } = await deleteExpiredRecruiterAccountsService.execute();

    return res.status(200).json({
      message: 'Contas de recrutador expiradas removidas com sucesso.',
      deletedCount,
    });
  }
}
