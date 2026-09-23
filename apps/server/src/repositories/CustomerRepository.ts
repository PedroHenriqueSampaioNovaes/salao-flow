import { prisma, PrismaClientOrTransaction } from '@/src/lib/prisma.js';

interface CreateCustomer {
  name: string;
  email?: string;
  phone: string;
  isBlocked: boolean;
}

interface UpdateCustomer {
  id: number;
  name?: string;
  phone?: string;
  email?: string;
  isBlocked?: boolean;
}

export class CustomerRepository {
  async create(
    data: CreateCustomer,
    barbershopId: number,
    client: PrismaClientOrTransaction = prisma,
  ) {
    const customer = await client.customer.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        isBlocked: data.isBlocked,
        barbershopId,
      },
      omit: {
        updatedAt: true,
        barbershopId: true,
        createdAt: true,
      },
    });

    return customer;
  }

  async updateProfileAndVisitCount(
    data: UpdateCustomer,
    client: PrismaClientOrTransaction = prisma,
  ) {
    return client.customer.update({
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

  async getById(id: number, barbershopId: number) {
    const customer = await prisma.customer.findFirst({
      where: { id, barbershopId },
    });
    return customer;
  }

  async getByEmail(email: string, barbershopId: number) {
    return prisma.customer.findFirst({
      where: { email, barbershopId },
    });
  }

  async update(data: UpdateCustomer) {
    return prisma.customer.update({
      where: { id: data.id },
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        isBlocked: data.isBlocked,
      },
      omit: {
        updatedAt: true,
        barbershopId: true,
      },
    });
  }

  async listByBarbershopId(barbershopId: number) {
    const customers = await prisma.customer.findMany({
      where: { barbershopId },
    });
    return customers;
  }

  async delete(id: number) {
    await prisma.customer.delete({
      where: { id },
    });
  }

  async getByPhone(
    phone: string,
    barbershopId: number,
    client: PrismaClientOrTransaction = prisma,
  ) {
    const customer = await client.customer.findFirst({
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
