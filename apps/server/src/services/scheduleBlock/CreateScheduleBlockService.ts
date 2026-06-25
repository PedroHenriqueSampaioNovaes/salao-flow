import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';

import { CreateScheduleBlockSchema } from '@sistema-barbearia/validators';

export class CreateScheduleBlockService {
  async execute(data: CreateScheduleBlockSchema, barbershopId: number) {
    const scheduleBlockRepository = new ScheduleBlockRepository();

    const scheduleBlock = await scheduleBlockRepository.create(
      data,
      data.employeeIds,
      barbershopId,
    );

    return scheduleBlock;
  }
}
