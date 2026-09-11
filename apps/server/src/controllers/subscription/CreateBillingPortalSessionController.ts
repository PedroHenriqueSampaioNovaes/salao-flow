import { Request, Response } from 'express';

import { CreateBillingPortalSessionService } from '@/src/services/subscription/CreateBillingPortalSessionService.js';

export class CreateBillingPortalSessionController {
  static async handle(req: Request, res: Response) {
    const createBillingPortalSessionService =
      new CreateBillingPortalSessionService();

    const result = await createBillingPortalSessionService.execute(
      Number(req.barbershopId),
    );

    return res.status(200).json(result);
  }
}
