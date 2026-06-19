import { prisma } from '@/src/lib/prisma.js';

import { UpdateEmployeeData } from '../interfaces/Employee.js';

interface CreateEmployeeData {
  name: string;
  image?: string;
  barbershopId: number;
  employeeScheduleId: string;
  serviceIds: string[];
}

export class EmployeeRepository {
  async create(data: CreateEmployeeData) {
    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        image: data.image,
        barbershopId: data.barbershopId,
        employeeScheduleId: data.employeeScheduleId,
        services: {
          connect: data.serviceIds.map((id) => ({
            id,
          })),
        },
      },
      select: {
        id: true,
        employeeScheduleId: true,
        name: true,
        image: true,
      },
    });

    return employee;
  }

  async getById(id: number, barbershopId: number) {
    const employee = await prisma.employee.findUnique({
      where: {
        id,
        barbershopId,
      },
      include: {
        employeeSchedule: true,
      },
    });

    return employee;
  }

  async getByIds(ids: number[], barbershopId: number) {
    const employees = await prisma.employee.findMany({
      where: {
        id: {
          in: ids,
        },
        barbershopId,
      },
    });

    return employees;
  }

  async getByIdWithEmployeeSchedule(id: number) {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        employeeSchedule: {
          include: {
            employeeScheduleWeekdays: true,
          },
        },
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
        employeeScheduleId: data.employeeScheduleId,
      },
      select: {
        id: true,
        employeeScheduleId: true,
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
