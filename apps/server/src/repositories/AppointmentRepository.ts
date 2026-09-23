import { prisma, PrismaClientOrTransaction } from '@/src/lib/prisma.js';

interface AppointmentServiceSnapshot {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface AppointmentData {
  dateString: string;
  totalServiceDuration: number;
  employeeId: number;
  customerId: number;
  services: AppointmentServiceSnapshot[];
}

interface EmployeeShift {
  employeeShiftStart: string;
  employeeShiftEnd: string;
}

export class AppointmentRepository {
  async create(
    data: AppointmentData,
    barbershopId: number,
    client: PrismaClientOrTransaction = prisma,
  ) {
    const appointment = await client.appointment.create({
      data: {
        date: data.dateString,
        barbershopId,
        employeeId: data.employeeId,
        customerId: data.customerId,
        totalServiceDuration: data.totalServiceDuration,
        appointmentServices: {
          create: data.services.map((service) => ({
            name: service.name,
            price: service.price,
            duration: service.duration,
            serviceId: service.id,
          })),
        },
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
        appointmentServices: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        customerId: true,
        employeeId: true,
        barbershopId: true,
      },
    });

    const { appointmentServices, ...rest } = appointment;
    return { ...rest, services: appointmentServices };
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
    client: PrismaClientOrTransaction = prisma,
  ) {
    const appointments = await client.appointment.findMany({
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

  async acquireEmployeeLock(
    employeeId: number,
    client: PrismaClientOrTransaction,
  ) {
    await client.$queryRaw`SELECT pg_advisory_xact_lock(${employeeId})`;
  }

  async getAppointmentsForMonth(dateInUTC: string, barbershopId: number) {
    const startOfMonth = new Date(dateInUTC);
    startOfMonth.setUTCDate(1);
    startOfMonth.setUTCHours(0, 0, 0, 0);

    const endOfMonth = new Date(dateInUTC);
    endOfMonth.setUTCMonth(startOfMonth.getUTCMonth() + 1);

    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lt: endOfMonth,
        },
        barbershopId,
      },
      orderBy: {
        date: 'asc',
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
        appointmentServices: {
          select: {
            name: true,
            price: true,
          },
        },
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        customerId: true,
        employeeId: true,
      },
    });

    return appointments.map(({ appointmentServices, ...rest }) => ({
      ...rest,
      services: appointmentServices,
    }));
  }

  async delete(id: string) {
    await prisma.appointment.delete({
      where: { id },
    });
  }

  async deleteManyByCustomerId(customerId: number) {
    await prisma.appointment.deleteMany({
      where: { customerId },
    });
  }

  async deleteManyByEmployeeId(employeeId: number) {
    await prisma.appointment.deleteMany({
      where: { employeeId },
    });
  }

  async deleteManyOlderThan(date: Date) {
    const { count } = await prisma.appointment.deleteMany({
      where: {
        date: {
          lt: date,
        },
      },
    });

    return count;
  }
}
