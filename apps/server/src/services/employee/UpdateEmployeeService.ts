import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { EmployeeScheduleRepository } from '@/src/repositories/EmployeeScheduleRepository.js';

import { UpdateEmployeeData } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateEmployeeService {
  async execute(data: UpdateEmployeeData, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const employeeScheduleRepository = new EmployeeScheduleRepository();

    const employee = await employeeRepository.getById(data.id, barbershopId);
    if (!employee) {
      throw new AppError('Funcionário não encontrado ou não existe.', 404);
    }

    if (employee.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para atualizar os dados deste funcionário.',
        403,
      );
    }

    if (data.employeeScheduleId) {
      const employeeScheduleExists =
        !!(await employeeScheduleRepository.getById(data.employeeScheduleId));

      if (!employeeScheduleExists) {
        throw new AppError('Expediente não encontrado ou não existe.', 404);
      }
    }

    const image =
      data.image ||
      `https://ui-avatars.com/api/?name=${data.name}&size=128&rounded=true`;

    const employeeUpdated = await employeeRepository.update({
      id: data.id,
      name: data.name,
      image,
      employeeScheduleId: data.employeeScheduleId,
    });

    return employeeUpdated;
  }
}
