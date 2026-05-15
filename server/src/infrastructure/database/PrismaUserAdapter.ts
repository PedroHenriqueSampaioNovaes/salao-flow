import { prisma } from '@/lib/prisma.js';

import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { CreateUserRequest } from '@/src/types/CreateUserRequest.js';

export class PrismaUserAdapter implements UserRepository {
  async create(user: CreateUserRequest) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        employees: {
          create: user.employees,
        },
      },
    });
  }

  async findByEmail(email: string) {
    const prismaUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!prismaUser) return null;

    return {
      name: prismaUser.name,
      email: prismaUser.email,
      password: prismaUser.password,
      customerId: prismaUser.customerId,
      address: prismaUser.address,
      phone: prismaUser.phone,
      status: prismaUser.status,
      image: prismaUser.image ?? undefined,
    };
  }
}
