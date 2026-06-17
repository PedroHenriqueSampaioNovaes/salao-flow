import { prisma } from '@/src/lib/prisma.js';

import { EmployeeScheduleWeekday } from '../interfaces/Employee.js';

interface CreateEmployeeSchedule {
  name: string;
  weekdays: EmployeeScheduleWeekday[];
}

export class EmployeeScheduleRepository {
  async create(data: CreateEmployeeSchedule, barbershopId: number) {
    const employeeSchedule = await prisma.employeeSchedule.create({
      data: {
        name: data.name,
        employeeScheduleWeekdays: {
          create: data.weekdays.map(
            ({ weekday, isWorkingDay, start, startLunch, endLunch, end }) => ({
              weekday,
              start,
              startLunch,
              endLunch,
              end,
              isWorkingDay,
            }),
          ),
        },
        barbershop: {
          connect: {
            id: barbershopId,
          },
        },
      },
      omit: {
        isDefault: true,
        barbershopId: true,
      },
    });

    return employeeSchedule;
  }

  async getById(id: string) {
    const employeeSchedule = await prisma.employeeSchedule.findUnique({
      where: { id },
      include: {
        employeeScheduleWeekdays: {
          omit: {
            employeeScheduleId: true,
          },
        },
      },
    });

    return employeeSchedule;
  }

  async listByBarbershopId(barbershopId: number) {
    const employeeSchedule = await prisma.employeeSchedule.findMany({
      where: { barbershopId },
      include: {
        employeeScheduleWeekdays: {
          omit: {
            employeeScheduleId: true,
          },
        },
      },
    });

    return employeeSchedule;
  }

  async update(
    data: Partial<CreateEmployeeSchedule>,
    employeeScheduleId: string,
    barbershopId: number,
  ) {
    const employeeSchedule = await prisma.employeeSchedule.update({
      where: { id: employeeScheduleId, barbershopId },
      data: {
        name: data.name,
        employeeScheduleWeekdays: {
          updateMany: data.weekdays?.map(
            ({ weekday, isWorkingDay, start, startLunch, endLunch, end }) => ({
              where: { weekday },
              data: {
                start,
                startLunch,
                endLunch,
                end,
                isWorkingDay,
              },
            }),
          ),
        },
        barbershop: {
          connect: {
            id: barbershopId,
          },
        },
      },
      include: {
        employeeScheduleWeekdays: true,
      },
      omit: {
        isDefault: true,
        barbershopId: true,
      },
    });

    return employeeSchedule;
  }

  async getDefaultSchedule(barbershopId: number) {
    const employeeSchedule = await prisma.employeeSchedule.findFirst({
      where: { barbershopId, isDefault: true },
    });

    return employeeSchedule;
  }

  async delete(
    barbershopId: number,
    employeeScheduleId: string,
    defaultScheduleId: string,
  ) {
    await prisma.$transaction([
      prisma.employee.updateMany({
        where: { employeeScheduleId, barbershopId },
        data: { employeeScheduleId: defaultScheduleId },
      }),
      prisma.employeeSchedule.delete({
        where: { id: employeeScheduleId, barbershopId },
      }),
    ]);
  }
}
