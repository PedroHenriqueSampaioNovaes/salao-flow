import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { UpdateEmployeeData } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

export class DetailsEmployeeService {
  async execute(data: UpdateEmployeeData, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);
    if (!barbershop) {
      throw new AppError('Acesso negado.', 401);
    }

    const employeeBelongsToTheBarbershop = barbershop.employees.some(
      (employee) => employee.id === data.id,
    );
    if (!employeeBelongsToTheBarbershop) {
      throw new AppError('Funcionário não encontrado.', 404);
    }

    const employee = await employeeRepository.getById(data.id);
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
