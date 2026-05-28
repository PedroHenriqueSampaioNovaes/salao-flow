import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { OperatingTimeRepository } from '@/src/repositories/OperatingTimeRepository.js';

import { UpdateEmployeeData } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateEmployeeService {
  async execute(data: UpdateEmployeeData, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const operatingTimeRepository = new OperatingTimeRepository();

    const employee = await employeeRepository.getByBarbershopAndEmployeeId(
      barbershopId,
      data.id,
    );
    if (!employee) {
      throw new AppError('Funcionário não encontrado ou não existe.', 403);
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

    const employeeUpdated = await employeeRepository.update({
      id: data.id,
      name: data.name,
      image,
      operatingTimeId: data.operatingTimeId,
    });

    return employeeUpdated;
  }
}
