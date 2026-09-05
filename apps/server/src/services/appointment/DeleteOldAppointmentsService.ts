import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

export class DeleteOldAppointmentsService {
  async execute() {
    const appointmentRepository = new AppointmentRepository();

    const oneWeekAgo = new Date(Date.now() - ONE_WEEK_IN_MS);

    const deletedCount =
      await appointmentRepository.deleteManyOlderThan(oneWeekAgo);

    return { deletedCount };
  }
}
