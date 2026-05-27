import { prisma } from '@/src/lib/prisma.js';

export class OperatingTimeRepository {
  async getById(id: string) {
    const operatingTime = await prisma.operatingTime.findUnique({
      where: { id },
    });

    return operatingTime;
  }
}
