import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { OperatingTimeRepository } from '@/src/repositories/OperatingTimeRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { UpdateEmployeeData } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateEmployeeService {
  async execute(data: UpdateEmployeeData, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const operatingTimeRepository = new OperatingTimeRepository();
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);
    if (!barbershop) {
      throw new AppError('Acesso negado.', 401);
    }

    const employeeBelongsToTheBarbershop = barbershop.employees.some(
      (employee) => employee.id === data.id,
    );
    if (!employeeBelongsToTheBarbershop) {
      throw new AppError(
        'Você não tem permissão para editar este funcionário.',
        403,
      );
    }

    const employeeExists = !!(await employeeRepository.getById(data.id));
    if (!employeeExists) {
      throw new AppError('Funcionário não encontrado ou não existe.', 404);
    }

    if (data.operatingTimeId) {
      const operatingTimeExists = !!(await operatingTimeRepository.getById(
        data.operatingTimeId,
      ));

      if (!operatingTimeExists) {
        throw new AppError(
          'Horário de funcionamento não encontrado ou não existe.',
          404,
        );
      }
    }

    const image =
      data.image ||
      `https://ui-avatars.com/api/?name=${data.name}&size=128&rounded=true`;

    const employee = await employeeRepository.update({
      id: data.id,
      name: data.name,
      image,
      operatingTimeId: data.operatingTimeId,
    });

    return employee;
  }
}
