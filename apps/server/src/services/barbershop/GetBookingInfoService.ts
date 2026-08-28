import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { Temporal } from '@js-temporal/polyfill';

export class GetBookingInfoService {
  async execute(slug: string) {
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getBySlug(slug);

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada.', 404);
    }

    const now = Temporal.Now.zonedDateTimeISO(barbershop.timezone);

    const threeMonthsFromNow = now.add({ months: 3 });

    const bookingInfo = await barbershopRepository.getBookingInfoBySlug(
      slug,
      now.toInstant().toString(),
      threeMonthsFromNow.toInstant().toString(),
    );

    if (!bookingInfo) {
      throw new AppError('Barbearia não encontrada.', 404);
    }

    if (!bookingInfo.status) {
      throw new AppError('Barbearia desativada.', 403);
    }

    return {
      name: bookingInfo.name,
      businessName: bookingInfo.businessName,
      address: bookingInfo.address,
      phone: bookingInfo.phone,
      image: bookingInfo.image,
      timezone: bookingInfo.timezone,
      status: bookingInfo.status,
      employees: bookingInfo.employees,
      instantLocalTime: now.toInstant(),
      facebookUrl: bookingInfo.facebookUrl,
      instagramUrl: bookingInfo.instagramUrl,
    };
  }
}
