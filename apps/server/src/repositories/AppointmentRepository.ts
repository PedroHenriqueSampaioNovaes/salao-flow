import { prisma } from '@/src/lib/prisma.js';

export interface AppointmentData {
  dateString: string;
  totalServiceDuration: number;
  employeeId: number;
  customerId: number;
  serviceIds: string[];
}

interface EmployeeShift {
  employeeShiftStart: string;
  employeeShiftEnd: string;
}

export class AppointmentRepository {
  async create(data: AppointmentData, barbershopId: number) {
    const appointment = await prisma.appointment.create({
      data: {
        date: data.dateString,
        barbershopId,
        employeeId: data.employeeId,
        customerId: data.customerId,
        totalServiceDuration: data.totalServiceDuration,
        services: {
          connect: data.serviceIds.map((id) => ({ id })),
        },
      },
      select: {
        date: true,
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

  async getByEmployeeShiftUtcAndEmployeeId(
    { employeeShiftStart, employeeShiftEnd }: EmployeeShift,
    employeeId: number,
  ) {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: employeeShiftStart,
          lt: employeeShiftEnd,
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
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
        services: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        totalServiceDuration: true,
        customerId: true,
        employeeId: true,
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
