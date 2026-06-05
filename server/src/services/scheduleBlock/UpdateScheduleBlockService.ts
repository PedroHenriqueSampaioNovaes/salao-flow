import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
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
    const employeeRepository = new EmployeeRepository();

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

    if (data.employeeId) {
      const employee = await employeeRepository.getById(data.employeeId);

      if (!employee) {
        throw new AppError('Funcionário não encontrado.', 404);
      }

      if (employee.barbershopId !== barbershopId) {
        throw new AppError('Funcionário não pertence a esta barbearia.', 403);
      }
    }

    const updatedScheduleBlock = await scheduleBlockRepository.update(
      data,
      scheduleBlockId,
    );

    return updatedScheduleBlock;
  }
}
