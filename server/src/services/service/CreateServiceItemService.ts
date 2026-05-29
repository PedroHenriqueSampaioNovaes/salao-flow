import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';

import { CreateServiceSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class CreateServiceItemService {
  async execute(data: CreateServiceSchema, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const serviceRepository = new ServiceRepository();

    let employeeIds = data.employeeId ? [data.employeeId] : [];

    if (employeeIds.length === 1) {
      const employee = await employeeRepository.getByBarbershopAndEmployeeId(
        barbershopId,
        employeeIds[0],
      );

      if (!employee) {
        throw new AppError('Funcionário não encontrado ou não existe', 404);
      }
    } else {
      const employees =
        await employeeRepository.listByBarbershopId(barbershopId);

      employeeIds = employees.map((e) => e.id);
    }

    const service = await serviceRepository.create(
      data,
      employeeIds,
      barbershopId,
    );

    return service;
  }
}
