import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteAppointmentService {
  async execute(id: string, barbershopId: number) {
    const appointmentRepository = new AppointmentRepository();

    const appointment = await appointmentRepository.getById(id);

    if (!appointment) {
      throw new AppError('Nenhum agendamento encontrado.', 404);
    }

    if (appointment.barbershopId !== Number(barbershopId)) {
      throw new AppError('Nenhum agendamento encontrado.', 403);
    }

    await appointmentRepository.delete(id);
  }
}
