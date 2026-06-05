import { prisma } from '@/src/lib/prisma.js';

export interface ScheduleBlockData {
  name: string;
  initialDate: Date;
  finalDate: Date;
  initialTime: string;
  finalTime: string;
  employeeId: number;
}

export class ScheduleBlockRepository {
  async create(data: ScheduleBlockData, barbershopId: number) {
    const scheduleBlock = await prisma.scheduleBlock.create({
      data: {
        name: data.name,
        initialDate: data.initialDate,
        finalDate: data.finalDate,
        initialTime: data.initialTime,
        finalTime: data.finalTime,
        barbershopId,
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
