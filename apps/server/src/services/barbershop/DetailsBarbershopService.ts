import { Temporal } from '@js-temporal/polyfill';

import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

export class DetailsBarbershopService {
  async execute(barbershopId: number) {
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada.', 404);
    }

    const now = Temporal.Now.zonedDateTimeISO(barbershop.timezone);

    return {
      email: barbershop.email,
      name: barbershop.name,
      image: barbershop.image,
      address: barbershop.address,
      phone: barbershop.phone,
      status: barbershop.status,
      slug: barbershop.slug,
      timezone: barbershop.timezone,
      instantLocalTime: now.toInstant(),
    };
  }
}
