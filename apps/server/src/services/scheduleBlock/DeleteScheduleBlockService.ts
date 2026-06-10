import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteScheduleBlockService {
  async execute(scheduleBlockId: string, barbershopId: number) {
    const scheduleBlockRepository = new ScheduleBlockRepository();

    const scheduleBlock =
      await scheduleBlockRepository.getById(scheduleBlockId);
    if (!scheduleBlock) {
      throw new AppError('Bloqueio de expediente não encontrado.', 404);
    }

    if (scheduleBlock.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para deletar este bloqueio de expediente.',
        403,
      );
    }

    await scheduleBlockRepository.delete(scheduleBlockId);
  }
}
