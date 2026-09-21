import { EmployeeScheduleRepository } from '@/src/repositories/EmployeeScheduleRepository.js';

import { UpdateEmployeeScheduleSchema } from '@sistema-barbearia/validators';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateEmployeeScheduleService {
  async execute(
    data: UpdateEmployeeScheduleSchema,
    barbershopId: number,
    id: string,
  ) {
    const employeeScheduleRepository = new EmployeeScheduleRepository();

    const hasInvalidWorkday = data.weekdays?.some((day) => {
      const isMissingHours = !day.start || !day.end;
      const isLunchIncomplete = !day.startLunch !== !day.endLunch;

      return day.isWorkingDay && (isMissingHours || isLunchIncomplete);
    });

    if (hasInvalidWorkday) {
      throw new AppError(
        'Obrigatório informar todos os horários do dia de trabalho.',
        400,
      );
    }

    const employeeSchedule = await employeeScheduleRepository.getById(id);

    if (!employeeSchedule) {
      throw new AppError('Expediente do usuário não encontrado.', 404);
    }

    if (employeeSchedule.barbershopId !== barbershopId) {
      throw new AppError('Expediente do usuário não encontrado.', 404);
    }

    const updatedEmployeeSchedule = await employeeScheduleRepository.update(
      data,
      id,
      barbershopId,
    );

    return updatedEmployeeSchedule;
  }
}
