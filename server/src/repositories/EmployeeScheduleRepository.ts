import { prisma } from '@/src/lib/prisma.js';

export class EmployeeScheduleRepository {
  async getById(id: string) {
    const employeeSchedule = await prisma.employeeSchedule.findUnique({
      where: { id },
    });

    return employeeSchedule;
  }
}
