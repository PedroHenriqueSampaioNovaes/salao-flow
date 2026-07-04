import { Request, Response } from 'express';

import { AppError } from '@/src/errors/AppError.js';

import { GetAvailableSlotsService } from '@/src/services/barbershop/GetAvailableSlotsService.js';

export class GetAvailableSlotsController {
  static async handle(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const { date, employeeId } = req.query as {
      date: string;
      employeeId?: string;
    };

    if (!date) throw new AppError('Parâmetro date é obrigatório.', 400);

    const getAvailableSlotsService = new GetAvailableSlotsService();

    const result = await getAvailableSlotsService.execute(
      slug,
      date,
      employeeId ? Number(employeeId) : undefined,
    );

    return res.status(200).json(result);
  }
}
