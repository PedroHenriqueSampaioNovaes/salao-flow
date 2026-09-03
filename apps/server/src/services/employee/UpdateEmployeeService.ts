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

    const newEmployeeData: Partial<UpdateEmployeeData> = {
      name: data.name,
      employeeScheduleId: employee.employeeScheduleId,
      image: employee.image,
    };

    if (data.employeeScheduleId) {
      const employeeScheduleExists =
        !!(await employeeScheduleRepository.getById(data.employeeScheduleId));

      if (!employeeScheduleExists) {
        throw new AppError('Expediente não encontrado ou não existe.', 404);
      }

      newEmployeeData.employeeScheduleId = data.employeeScheduleId;
    }

    if (data.name) {
      newEmployeeData.image = `https://ui-avatars.com/api/?name=${data.name}&size=80`;
    }

    const employeeUpdated = await employeeRepository.update(
      employee.id,
      newEmployeeData,
    );

    return {
      id: employeeUpdated.id,
      employeeScheduleId: employeeUpdated.employeeScheduleId,
      image: employeeUpdated.image,
      name: employeeUpdated.name,
      services: employeeUpdated.services,
    };
  }
}
