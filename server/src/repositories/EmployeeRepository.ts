import { prisma } from '@/src/lib/prisma.js';

import { UpdateEmployeeData } from '../interfaces/Employee.js';

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

  async getById(id: number) {
    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        barbershopId: true,
        operatingTimeId: true,
      },
      include: {
        operatingTime: {
          omit: {
            barbershopId: true,
            isDefault: true,
            id: true,
          },
        },
        appointments: {
          omit: {
            id: true,
            createdAt: true,
            updatedAt: true,
            employeeId: true,
          },
        },
        services: {
          omit: {
            id: true,
            barbershopId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return employee;
  }

  async update(data: UpdateEmployeeData) {
    const employee = await prisma.employee.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        image: data.image,
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
