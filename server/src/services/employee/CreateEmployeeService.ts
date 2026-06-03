import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { EmployeeScheduleRepository } from '@/src/repositories/EmployeeScheduleRepository.js';

import { EmployeeSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class CreateEmployeeService {
  async execute(data: EmployeeSchema, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const employeeScheduleRepository = new EmployeeScheduleRepository();

    const employeeScheduleExists = await employeeScheduleRepository.getById(
      data.employeeScheduleId,
    );

    if (!employeeScheduleExists) {
      throw new AppError(
        'Horário de funcionamento não encontrado ou não existe.',
        404,
      );
    }

    const image =
      data.image ||
      `https://ui-avatars.com/api/?name=${data.name}&size=128&rounded=true`;

    const employee = await employeeRepository.create({
      name: data.name,
      image,
      barbershopId,
      employeeScheduleId: data.employeeScheduleId,
    });

    return employee;
  }
}
