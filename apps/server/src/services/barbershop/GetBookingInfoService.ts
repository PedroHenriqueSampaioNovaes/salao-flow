import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { formatDateToTimezone } from '@/src/utils/formatDateToTimezone.js';

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

    const localtime = formatDateToTimezone(new Date(), bookingInfo.timezone);

    return { ...bookingInfo, localtime };
  }
}
