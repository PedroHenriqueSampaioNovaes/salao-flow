import { prisma } from '@/src/lib/prisma.js';

interface CreateCustomer {
  name: string;
  email?: string;
  phone: string;
}

interface UpdateCustomer {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  isBlocked?: boolean;
}

export class CustomerRepository {
  async create(data: CreateCustomer, barbershopId: number) {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        barbershopId,
      },
      omit: {
        updatedAt: true,
        isBlocked: true,
        barbershopId: true,
        createdAt: true,
      },
    });

    return customer;
  }

  async updateProfileAndVisitCount(data: UpdateCustomer) {
    return prisma.customer.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        email: data.email,
        visitCount: {
          increment: 1,
        },
        isBlocked: data.isBlocked,
      },
      omit: {
        updatedAt: true,
      },
    });
  }

  async getByPhone(phone: string, barbershopId: number) {
    const customer = await prisma.customer.findFirst({
      where: {
        phone,
        barbershopId,
      },
      omit: {
        updatedAt: true,
      },
    });

    return customer;
  }
}
