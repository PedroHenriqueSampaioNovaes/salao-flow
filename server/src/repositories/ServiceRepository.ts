import { prisma } from '@/src/lib/prisma.js';

import {
  CreateServiceSchema,
  UpdateServiceSchema,
} from '@sistema-barbearia/validators';

export class ServiceRepository {
  async create(
    data: CreateServiceSchema,
    employeeIds: number[],
    barbershopId: number,
  ) {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        barbershopId,
        employees: {
          connect: employeeIds.map((id) => ({ id })),
        },
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

  async update(
    data: Omit<UpdateServiceSchema, 'employeeId'>,
    employeeIds: number[],
  ) {
    const service = await prisma.service.update({
      where: { id: data.id },
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        status: data.status,
        employees: {
          set: employeeIds.map((id) => ({ id })),
        },
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
