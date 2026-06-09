import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';

import { ServiceSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class CreateServiceItemService {
  async execute(data: ServiceSchema, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const serviceRepository = new ServiceRepository();

    let employeeIds = [];

    if (data.assignToAllEmployees) {
      const employees =
        await employeeRepository.listByBarbershopId(barbershopId);

      employeeIds.push(...employees.map((e) => e.id));
    } else {
      const employee = await employeeRepository.getById(
        Number(data.employeeId),
      );

      if (!employee) {
        throw new AppError('Funcionário não encontrado ou não existe', 404);
      }

      if (employee.barbershopId !== barbershopId) {
        throw new AppError(
          'Você não tem permissão para criar este serviço',
          403,
        );
      }

      employeeIds.push(employee.id);
    }

    const { employeeId, ...serviceData } = data;

    const service = await serviceRepository.create(
      serviceData,
      employeeIds,
      barbershopId,
    );

    return service;
  }
}
