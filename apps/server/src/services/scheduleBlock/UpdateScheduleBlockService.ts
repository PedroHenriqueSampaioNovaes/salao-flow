import { Temporal } from '@js-temporal/polyfill';

import {
  ScheduleBlockRepository,
  UpdateScheduleBlockData,
} from '@/src/repositories/ScheduleBlockRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { UpdateScheduleBlockSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';
import { extractDateAndTimeFromISOString } from '@/src/utils/scheduleHelpers.js';

export class UpdateScheduleBlockService {
  async execute(
    scheduleBlockId: string,
    data: UpdateScheduleBlockSchema,
    barbershopId: number,
  ) {
    const scheduleBlockRepository = new ScheduleBlockRepository();
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);
    if (!barbershop) throw new AppError('Barbearia não encontrada.', 404);

    const scheduleBlock =
      await scheduleBlockRepository.getById(scheduleBlockId);

    if (!scheduleBlock) {
      throw new AppError('Bloqueio de expediente não encontrado.', 404);
    }

    if (scheduleBlock.barbershopId !== barbershop.id) {
      throw new AppError(
        'Você não tem permissão para editar este bloqueio de expediente.',
        403,
      );
    }

    const updateData: UpdateScheduleBlockData = {
      name: data.name ?? scheduleBlock.name,
      initialDate: Temporal.Instant.from(
        scheduleBlock.initialDate.toISOString(),
      ).toString(),
      finalDate: Temporal.Instant.from(
        scheduleBlock.finalDate.toISOString(),
      ).toString(),
      employeeIds: data.employeeIds,
    };
    if (data.initialDate && data.initialTime) {
      const [year, month, day] = data.initialDate.split('-').map(Number);
      const [hour, minute] = data.initialTime.split(':').map(Number);
      updateData.initialDate = Temporal.ZonedDateTime.from({
        year,
        month,
        day,
        hour,
        minute,
        timeZone: barbershop.timezone,
      })
        .toInstant()
        .toString();
    }

    if (data.finalDate && data.finalTime) {
      const [yearFinal, monthFinal, dayFinal] = data.finalDate
        .split('-')
        .map(Number);
      const [hourFinal, minuteFinal] = data.finalTime.split(':').map(Number);
      updateData.finalDate = Temporal.ZonedDateTime.from({
        year: yearFinal,
        month: monthFinal,
        day: dayFinal,
        hour: hourFinal,
        minute: minuteFinal,
        timeZone: barbershop.timezone,
      })
        .toInstant()
        .toString();
    }

    const initial = extractDateAndTimeFromISOString(updateData.initialDate!);
    const final = extractDateAndTimeFromISOString(updateData.finalDate!);

    if (final.date < initial.date) {
      throw new AppError(
        'Data final deve ser igual ou superior a data inicial',
      );
    }

    if (final.date === initial.date && initial.time >= final.time) {
      throw new AppError(
        'O horário final deve ser maior que o horário inicial no mesmo dia',
      );
    }

    const updatedScheduleBlock = await scheduleBlockRepository.update(
      updateData,
      scheduleBlockId,
      barbershopId,
    );

    return updatedScheduleBlock;
  }
}
