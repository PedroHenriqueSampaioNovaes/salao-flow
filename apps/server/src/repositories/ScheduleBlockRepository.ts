import { prisma } from '@/src/lib/prisma.js';

export interface ScheduleBlockData {
  name: string;
  initialDate: Date;
  finalDate: Date;
  employeeId: number;
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
  async create(data: ScheduleBlockData, barbershopId: number) {
    const scheduleBlock = await prisma.scheduleBlock.create({
      data: {
        name: data.name,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        barbershopId,
        employeeId: data.employeeId,
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

  async update(data: UpdateScheduleBlockData, id: string) {
    const scheduleBlock = await prisma.scheduleBlock.update({
      where: { id },
      data: {
        name: data.name,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        employeeId: data.employeeId,
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
