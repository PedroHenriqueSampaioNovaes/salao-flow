import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class ListAppointmentService {
  async execute(date: Date, barbershopId: number) {
    const appointmentRepository = new AppointmentRepository();

    const appointments = await appointmentRepository.getAppointmentsForMonth(
      date,
      barbershopId,
    );

    const appointmentsBelongToBarbershop = appointments.every(
      (appointment) => appointment.barbershopId === barbershopId,
    );

    if (!appointmentsBelongToBarbershop) {
      throw new AppError('Nenhum agendamento encontrado.', 403);
    }

    const listAppointment = appointments.map(
      ({ barbershopId, ...appointment }) => appointment,
    );

    return listAppointment;
  }
}
