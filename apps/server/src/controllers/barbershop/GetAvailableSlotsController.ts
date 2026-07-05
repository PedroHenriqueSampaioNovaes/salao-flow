import { Request, Response } from 'express';

import { AppError } from '@/src/errors/AppError.js';

import { GetAvailableSlotsService } from '@/src/services/barbershop/GetAvailableSlotsService.js';

export class GetAvailableSlotsController {
  static async handle(req: Request, res: Response) {
    const slug = req.params.slug as string;
    const { date, employeeId, lookForNextAvailableTimeSlot } = req.query as {
      date: string;
      lookForNextAvailableTimeSlot: string;
      employeeId?: string;
    };

    if (!date) throw new AppError('Parâmetro date é obrigatório.', 400);
    if (!lookForNextAvailableTimeSlot)
      throw new AppError(
        'Parâmetro lookForNextAvailableTimeSlot é obrigatório.',
        400,
      );

    const getAvailableSlotsService = new GetAvailableSlotsService();

    const result = await getAvailableSlotsService.execute(
      slug,
      date,
      Boolean(Number(lookForNextAvailableTimeSlot)),
      employeeId ? Number(employeeId) : undefined,
    );

    return res.status(200).json(result);
  }
}
