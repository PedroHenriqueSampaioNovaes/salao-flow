import { prisma } from '@/src/lib/prisma.js';

interface CreateEmployeeData {
  name: string;
  image?: string;
  barbershopId: number;
  operatingTimeId: string;
}

export class EmployeeRepository {
  async create(data: CreateEmployeeData) {
    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        image: data.image,
        barbershopId: data.barbershopId,
        operatingTimeId: data.operatingTimeId,
      },
      select: {
        name: true,
        image: true,
      },
    });

    return employee;
  }
}
