import { EmployeeScheduleRepository } from '@/src/repositories/EmployeeScheduleRepository.js';

import { EmployeeScheduleSchema } from '@sistema-barbearia/validators';

export class CreateEmployeeScheduleService {
  async execute(data: EmployeeScheduleSchema, barbershopId: number) {
    const employeeScheduleRepository = new EmployeeScheduleRepository();

    const employeeSchedule = await employeeScheduleRepository.create(
      data,
      barbershopId,
    );

    return employeeSchedule;
  }
}
