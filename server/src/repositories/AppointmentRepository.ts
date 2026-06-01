import { prisma } from '@/src/lib/prisma.js';

import { CreateAppointmentSchema } from '@sistema-barbearia/validators';

interface CreateAppointmentData extends CreateAppointmentSchema {
  totalServiceDuration: number;
}

export class AppointmentRepository {
  async create(data: CreateAppointmentData, barbershopId: number) {
    const appointment = await prisma.appointment.create({
      data: {
        name: data.name,
        phone: data.phone,
        date: data.date,
        time: data.time,
        barbershopId,
        employeeId: data.employeeId,
        totalServiceDuration: data.totalServiceDuration,
      },
      select: {
        name: true,
        phone: true,
        date: true,
        time: true,
      },
    });

    return appointment;
  }

  async getById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });

    return appointment;
  }

  async getByDateAndEmployeeId(date: Date, employeeId: number) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        employeeId,
      },
    });

    return appointments;
  }

  async getAppointmentsForMonth(date: Date, barbershopId: number) {
    const startOfMonth = new Date(date);
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const endOfMonth = new Date(date);
    endOfMonth.setUTCMonth(startOfMonth.getUTCMonth() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
        barbershopId,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        employeeId: true,
        totalServiceDuration: true,
      },
    });

    return appointments;
  }

  async delete(id: string) {
    await prisma.appointment.delete({
      where: { id },
    });
  }
}
