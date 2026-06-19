import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';

import { CreateScheduleBlockSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class CreateScheduleBlockService {
  async execute(data: CreateScheduleBlockSchema, barbershopId: number) {
    const scheduleBlockRepository = new ScheduleBlockRepository();
    const employeeRepository = new EmployeeRepository();

    const employee = await employeeRepository.getById(data.employeeId, barbershopId);

    if (!employee) {
      throw new AppError('Esse funcionário não encontrado.', 404);
    }

    if (employee.barbershopId !== barbershopId) {
      throw new AppError(
        'Esse funcionário não pertence a esta barbearia.',
        403,
      );
    }

    const scheduleBlock = await scheduleBlockRepository.create(
      data,
      barbershopId,
    );

    return scheduleBlock;
  }
}
