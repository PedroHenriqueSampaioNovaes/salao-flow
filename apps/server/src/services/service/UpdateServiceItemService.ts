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

    let employeeIds = data.employeeId ? [data.employeeId] : [];

    if (employeeIds.length === 1) {
      const employee = await employeeRepository.getById(employeeIds[0]);

      if (!employee) {
        throw new AppError('Funcionário não encontrado ou não existe', 404);
      }

      if (employee.barbershopId !== barbershopId) {
        throw new AppError(
          'Você não tem permissão para criar este serviço',
          403,
        );
      }
    } else {
      const employees =
        await employeeRepository.listByBarbershopId(barbershopId);

      employeeIds = employees.map((e) => e.id);
    }

    const { employeeId, ...updateData } = data;

    const updatedService = await serviceRepository.update(
      updateData,
      employeeIds,
    );

    return updatedService;
  }
}
