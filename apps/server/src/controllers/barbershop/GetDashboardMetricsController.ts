import { Request, Response } from 'express';

import { GetDashboardMetricsService } from '@/src/services/barbershop/GetDashboardMetricsService.js';

export class GetDashboardMetricsController {
  static async handle(req: Request, res: Response) {
    const getDashboardDataService = new GetDashboardMetricsService();

    const data = await getDashboardDataService.execute(
      Number(req.barbershopId),
    );

    return res.status(200).json(data);
  }
}
