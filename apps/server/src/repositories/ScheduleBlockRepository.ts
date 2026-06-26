import { prisma } from '@/src/lib/prisma.js';

export interface ScheduleBlockData {
  name: string;
  initialDate: Date;
  finalDate: Date;
}

export interface UpdateScheduleBlockData {
  name?: string;
  initialDate?: Date;
  finalDate?: Date;
  employeeId?: number;
}

interface DateConfig {
  startDate: Date;
  endDate: Date;
}

export class ScheduleBlockRepository {
  async create(
    data: ScheduleBlockData,
    employeeIds: number[],
    barbershopId: number,
  ) {
    const scheduleBlock = await prisma.scheduleBlock.create({
      data: {
        name: data.name,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        barbershopId,
        employees: {
          connect: employeeIds.map((id) => ({ id, barbershopId })),
        },
      },
    });

    return scheduleBlock;
  }

  async getById(id: string) {
    const scheduleBlock = await prisma.scheduleBlock.findUnique({
      where: { id },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    return scheduleBlock;
  }

  async listByBarbershopId(barbershopId: number) {
    const scheduleBlocks = await prisma.scheduleBlock.findMany({
      where: { barbershopId },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    return scheduleBlocks;
  }

  async ListByStartAndEndDate(dateConfig: DateConfig, barbershopId: number) {
    const { startDate, endDate } = dateConfig;

    const scheduleBlocks = await prisma.scheduleBlock.findMany({
      where: {
        barbershopId,
        initialDate: {
          lte: startDate,
        },
        finalDate: {
          gt: endDate,
        },
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    return scheduleBlocks;
  }

  async update(
    data: UpdateScheduleBlockData,
    id: string,
    barbershopId: number,
    employeeIds?: number[],
  ) {
    const scheduleBlock = await prisma.scheduleBlock.update({
      where: { id },
      data: {
        name: data.name,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        employees: {
          set: employeeIds?.map((id) => ({ id, barbershopId })),
        },
      },
      include: {
        employees: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    return scheduleBlock;
  }

  async delete(id: string) {
    await prisma.scheduleBlock.delete({
      where: { id },
    });
  }
}
