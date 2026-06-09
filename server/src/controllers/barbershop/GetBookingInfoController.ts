import { Request, Response } from 'express';

import { GetBookingInfoService } from '@/src/services/barbershop/GetBookingInfoService.js';

export class GetBookingInfoController {
  static async handle(req: Request, res: Response) {
    const slug = req.params.slug as string;

    const getBookingInfoService = new GetBookingInfoService();

    const bookingInfo = await getBookingInfoService.execute(slug);

    return res.status(200).json(bookingInfo);
  }
}
