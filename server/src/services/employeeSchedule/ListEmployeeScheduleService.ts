import { AppError } from '@/src/errors/AppError.js';

import { EmployeeScheduleRepository } from '@/src/repositories/EmployeeScheduleRepository.js';

export class ListEmployeeScheduleService {
  async execute(barbershopId: number) {
    const employeeScheduleRepository = new EmployeeScheduleRepository();

    const listEmployeeSchedule =
      await employeeScheduleRepository.listByBarbershopId(barbershopId);

    if (listEmployeeSchedule[0].barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para visualizar este expediente.',
        403,
      );
    }

    return listEmployeeSchedule;
  }
}
