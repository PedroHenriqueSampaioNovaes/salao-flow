import { AppError } from '@/src/errors/AppError.js';

import { EmployeeScheduleRepository } from '@/src/repositories/EmployeeScheduleRepository.js';

export class DetailsEmployeeScheduleService {
  async execute(employeeScheduleId: string, barbershopId: number) {
    const employeeScheduleRepository = new EmployeeScheduleRepository();

    const employeeSchedule =
      await employeeScheduleRepository.getById(employeeScheduleId);

    if (employeeSchedule?.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para visualizar este expediente.',
        403,
      );
    }

    return employeeSchedule;
  }
}
