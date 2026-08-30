import { prisma } from '@/src/lib/prisma.js';

export interface ScheduleBlockData {
  name: string;
  initialDate: string;
  finalDate: string;
  employeeIds: number[];
}

export interface UpdateScheduleBlockData {
  name?: string;
  initialDate?: string;
  finalDate?: string;
  employeeIds?: number[];
}

export class ScheduleBlockRepository {
  async create(data: ScheduleBlockData, barbershopId: number) {
    const scheduleBlock = await prisma.scheduleBlock.create({
      data: {
        name: data.name,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        barbershopId,
        employees: {
          connect: data.employeeIds.map((id) => ({ id, barbershopId })),
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

  async findByDateRangeAndEmployeeId(
    startDate: string,
    endDate: string,
    barbershopId: number,
    employeeId: number,
  ) {
    const scheduleBlocks = await prisma.scheduleBlock.findMany({
      where: {
        barbershopId,
        employees: {
          some: {
            id: employeeId,
            barbershopId,
          },
        },
        initialDate: { lt: endDate },
        finalDate: { gt: startDate },
      },
    });

    return scheduleBlocks;
  }

  async update(
    data: UpdateScheduleBlockData,
    id: string,
    barbershopId: number,
  ) {
    const scheduleBlock = await prisma.scheduleBlock.update({
      where: { id },
      data: {
        name: data.name,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        employees: {
          set: data.employeeIds?.map((id) => ({ id, barbershopId })),
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
