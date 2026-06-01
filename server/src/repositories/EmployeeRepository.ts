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
    });

    return employee;
  }

  async getByIdWithOperatingTime(id: number) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        operatingTime: true,
      },
    });
    return employee;
  }

  async listByBarbershopId(barbershopId: number) {
    const employees = await prisma.employee.findMany({
      where: {
        barbershopId,
      },
      omit: {
        barbershopId: true,
        operatingTimeId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return employees;
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

  async delete(id: number) {
    await prisma.employee.delete({
      where: {
        id,
      },
    });
  }
}
