import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class ListAppointmentService {
  async execute(dateStringParam: string, barbershopId: number) {
    const appointmentRepository = new AppointmentRepository();
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);
    if (!barbershop) throw new AppError('Barbearia não encontrada.', 404);

    const dateString =
      dateStringParam ||
      new Date().toLocaleDateString('en-CA', {
        timeZone: barbershop.timezone,
      });

    const appointments = await appointmentRepository.getAppointmentsForMonth(
      dateString,
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
