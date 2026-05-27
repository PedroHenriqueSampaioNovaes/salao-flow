import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { OperatingTimeRepository } from '@/src/repositories/OperatingTimeRepository.js';

import { EmployeeSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class CreateEmployeeService {
  async execute(data: EmployeeSchema, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const operatingTimeRepository = new OperatingTimeRepository();

    const operatingTimeExists = await operatingTimeRepository.getById(
      data.operatingTimeId,
    );

    if (!operatingTimeExists) {
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
      operatingTimeId: data.operatingTimeId,
    });

    return employee;
  }
}
