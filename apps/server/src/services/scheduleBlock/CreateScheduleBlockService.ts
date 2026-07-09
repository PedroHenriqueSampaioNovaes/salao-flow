import { Temporal } from '@js-temporal/polyfill';

import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { CreateScheduleBlockSchema } from '@sistema-barbearia/validators';

export class CreateScheduleBlockService {
  async execute(data: CreateScheduleBlockSchema, barbershopId: number) {
    const scheduleBlockRepository = new ScheduleBlockRepository();
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);
    if (!barbershop) {
      throw new Error('Barbearia não encontrada');
    }

    const [year, month, day] = data.initialDate.split('-').map(Number);
    const [hour, minute] = data.initialTime.split(':').map(Number);

    const initialDate = Temporal.ZonedDateTime.from({
      year,
      month,
      day,
      hour,
      minute,
      timeZone: barbershop.timezone,
    });

    const [yearFinal, monthFinal, dayFinal] = data.finalDate
      .split('-')
      .map(Number);
    const [hourFinal, minuteFinal] = data.finalTime.split(':').map(Number);

    const finalDate = Temporal.ZonedDateTime.from({
      year: yearFinal,
      month: monthFinal,
      day: dayFinal,
      hour: hourFinal,
      minute: minuteFinal,
      timeZone: barbershop.timezone,
    });

    const scheduleBlock = await scheduleBlockRepository.create(
      {
        ...data,
        initialDate: initialDate.toInstant().toString(),
        finalDate: finalDate.toInstant().toString(),
      },
      barbershopId,
    );

    return scheduleBlock;
  }
}
