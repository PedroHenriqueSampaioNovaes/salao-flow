import { EmployeeScheduleRepository } from '@/src/repositories/EmployeeScheduleRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteEmployeeScheduleService {
  async execute(barbershopId: number, employeeScheduleId: string) {
    const employeeScheduleRepository = new EmployeeScheduleRepository();

    const employeeSchedule =
      await employeeScheduleRepository.getById(employeeScheduleId);

    if (!employeeSchedule) {
      throw new AppError('Expediente não encontrado ou não existe.', 404);
    }

    if (employeeSchedule.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para deletar este expediente.',
        403,
      );
    }

    if (employeeSchedule.isDefault) {
      throw new AppError('Não é possível deletar o expediente padrão.', 400);
    }

    const defaultSchedule =
      await employeeScheduleRepository.getDefaultSchedule(barbershopId);

    await employeeScheduleRepository.delete(
      barbershopId,
      employeeScheduleId,
      defaultSchedule!.id,
    );
  }
}
