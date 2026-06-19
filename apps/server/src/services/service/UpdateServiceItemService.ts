import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';

import { UpdateServiceSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateServiceItemService {
  async execute(data: UpdateServiceSchema, barbershopId: number) {
    const serviceRepository = new ServiceRepository();
    const employeeRepository = new EmployeeRepository();

    const service = await serviceRepository.getById(data.id);

    if (!service) {
      throw new AppError('Serviço não encontrado', 404);
    }

    if (service.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para atualizar este serviço',
        403,
      );
    }

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

    const { employeeIds: _, ...updateData } = data;

    const updatedService = await serviceRepository.update(
      updateData,
      employeeIds,
    );

    return updatedService;
  }
}
