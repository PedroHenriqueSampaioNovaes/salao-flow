import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';

import { UpdateEmployeeData } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

export class DetailsEmployeeService {
  async execute(data: UpdateEmployeeData, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();

    const employee = await employeeRepository.getById(data.id);
    if (!employee) {
      throw new AppError('Funcionário não encontrado ou não existe.', 404);
    }

    if (employee.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para ver os dados deste funcionário.',
        403,
      );
    }

    return {
      id: employee.id,
      name: employee.name,
      image: employee.image,
      employeeScheduleId: employee.employeeScheduleId,
    };
  }
}
