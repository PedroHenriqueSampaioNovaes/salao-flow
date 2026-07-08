import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { Temporal } from '@js-temporal/polyfill';

export class GetBookingInfoService {
  async execute(slug: string) {
    const barbershopRepository = new BarbershopRepository();

    const now = new Date();

    const threeMonthsFromNow = new Date(now);
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const bookingInfo = await barbershopRepository.getBookingInfoBySlug(
      slug,
      now,
      threeMonthsFromNow,
    );

    if (!bookingInfo) {
      throw new AppError('Barbearia não encontrada.', 404);
    }

    const barbershopInstant = Temporal.Now.instant();

    return { ...bookingInfo, instantLocalTime: barbershopInstant };
  }
}
