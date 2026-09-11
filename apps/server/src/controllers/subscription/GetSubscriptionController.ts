import { Request, Response } from 'express';

import { GetSubscriptionService } from '@/src/services/subscription/GetSubscriptionService.js';

export class GetSubscriptionController {
  static async handle(req: Request, res: Response) {
    const getSubscriptionService = new GetSubscriptionService();

    const result = await getSubscriptionService.execute(
      Number(req.barbershopId),
    );

    return res.status(200).json(result);
  }
}
