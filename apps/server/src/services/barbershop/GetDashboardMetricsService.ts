import { Temporal } from '@js-temporal/polyfill';

import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

export class GetDashboardMetricsService {
  async execute(barbershopId: number) {
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada.', 404);
    }

    const now = Temporal.Now.zonedDateTimeISO(barbershop.timezone);
    const todayStart = now.startOfDay();
    const todayEnd = todayEndOfDay(now);

    const data = await barbershopRepository.getDashboardData(
      barbershopId,
      new Date(todayStart.toInstant().toString()),
      new Date(todayEnd.toString()),
    );

    return {
      customerCount: data?._count.customers ?? 0,
      employeeCount: data?._count.employees ?? 0,
      serviceCount: data?._count.services ?? 0,
      todayAppointmentsCount: data?._count.appointments ?? 0,
    };
  }
}

function todayEndOfDay(now: Temporal.ZonedDateTime) {
  return now
    .with({ hour: 23, minute: 59, second: 59, millisecond: 999 })
    .toInstant();
}
