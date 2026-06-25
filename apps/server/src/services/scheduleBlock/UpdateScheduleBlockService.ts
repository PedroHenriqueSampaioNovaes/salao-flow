import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';

import { UpdateScheduleBlockSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateScheduleBlockService {
  async execute(
    scheduleBlockId: string,
    data: UpdateScheduleBlockSchema,
    barbershopId: number,
  ) {
    const scheduleBlockRepository = new ScheduleBlockRepository();

    const scheduleBlock =
      await scheduleBlockRepository.getById(scheduleBlockId);

    if (!scheduleBlock) {
      throw new AppError('Bloqueio de expediente não encontrado.', 404);
    }

    if (scheduleBlock.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para editar este bloqueio de expediente.',
        403,
      );
    }

    const updatedScheduleBlock = await scheduleBlockRepository.update(
      data,
      scheduleBlockId,
      barbershopId,
      data.employeeIds,
    );

    return updatedScheduleBlock;
  }
}
