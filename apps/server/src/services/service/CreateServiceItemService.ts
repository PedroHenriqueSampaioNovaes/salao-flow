import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';

import { ServiceSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class CreateServiceItemService {
  async execute(data: ServiceSchema, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const serviceRepository = new ServiceRepository();

    const employeeIds: number[] = [];

    if (data.assignToAllEmployees) {
      const employees =
        await employeeRepository.listByBarbershopId(barbershopId);

      employeeIds.push(...employees.map((e) => e.id));
    } else {
      const requestedEmployeeIds = data.employeeIds ?? [];
      const employees = await employeeRepository.getByIds(
        requestedEmployeeIds,
        barbershopId,
      );
      const foundEmployeeIds = new Set(
        employees.map((employee) => employee.id),
      );
      const hasInvalidEmployee = requestedEmployeeIds.some(
        (employeeId) => !foundEmployeeIds.has(employeeId),
      );

      if (hasInvalidEmployee) {
        throw new AppError('Funcionário não encontrado ou não existe', 404);
      }

      employeeIds.push(...employees.map((e) => e.id));
    }

    const { employeeIds: _, ...serviceData } = data;

    const service = await serviceRepository.create(
      serviceData,
      employeeIds,
      barbershopId,
    );

    return service;
  }
}
