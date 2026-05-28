import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';

import { UpdateEmployeeData } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

export class DetailsEmployeeService {
  async execute(data: UpdateEmployeeData, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();

    const employee = await employeeRepository.getByBarbershopAndEmployeeId(
      barbershopId,
      data.id,
    );
    if (!employee) {
      throw new AppError('Funcionário não encontrado ou não existe.', 404);
    }

    return {
      id: employee.id,
      name: employee.name,
      image: employee.image,
    };
  }
}
