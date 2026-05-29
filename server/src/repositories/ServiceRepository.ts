import { prisma } from '@/src/lib/prisma.js';

import { CreateServiceSchema } from '@sistema-barbearia/validators';

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
}
