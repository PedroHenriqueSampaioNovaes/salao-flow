import { prisma } from '@/src/lib/prisma.js';

import {
  ServiceSchema,
  UpdateServiceSchema,
} from '@sistema-barbearia/validators';

export class ServiceRepository {
  async create(
    data: Omit<ServiceSchema, 'employeeId'>,
    employeeIds: number[],
    barbershopId: number,
  ) {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        barbershopId,
        employees: {
          connect: employeeIds.map((id) => ({ id })),
        },
        assignToAllEmployees: data.assignToAllEmployees,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        barbershopId: true,
      },
    });

    return service;
  }

  async getById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    return service;
  }

  async getServicesAvailableToAllEmployees(barbershopId: number) {
    const services = await prisma.service.findMany({
      where: {
        barbershopId,
        assignToAllEmployees: true,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        barbershopId: true,
      },
    });

    return services;
  }

  async listByIds(ids: string[]) {
    const services = await prisma.service.findMany({
      where: { id: { in: ids } },
      omit: {
        createdAt: false,
        updatedAt: false,
      },
    });

    return services;
  }

  async listByBarbershopId(barbershopId: number) {
    const services = await prisma.service.findMany({
      where: { barbershopId },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
    });

    return services;
  }

  async update(
    data: Omit<UpdateServiceSchema, 'employeeId'>,
    employeeIds: number[],
  ) {
    const service = await prisma.service.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        status: data.status,
        employees: {
          set: employeeIds.map((id) => ({ id })),
        },
        assignToAllEmployees: data.assignToAllEmployees || false,
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        barbershopId: true,
      },
    });

    return service;
  }

  async delete(id: string) {
    await prisma.service.delete({
      where: { id },
    });
  }
}
