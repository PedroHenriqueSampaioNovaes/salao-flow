import { AppError } from '@/src/errors/AppError.js';

import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';

export class ListScheduleBlockService {
  async execute(barbershopId: number) {
    const scheduleBlockRepository = new ScheduleBlockRepository();

    const scheduleBlocks =
      await scheduleBlockRepository.listByBarbershopId(barbershopId);

    if (
      scheduleBlocks.length &&
      scheduleBlocks[0].barbershopId !== barbershopId
    ) {
      throw new AppError(
        'Você não tem permissão para visualizar este bloqueio de expediente.',
        403,
      );
    }

    return scheduleBlocks;
  }
}
