import { prisma } from '@/lib/prisma.js';

import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { User } from '@/src/domain/entities/User.js';

export class PrismaUserAdapter implements UserRepository {
  async create(user: User) {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        address: user.address,
        times: user.times,
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
      times: prismaUser.times,
      image: prismaUser.image ?? undefined,
    };
  }
}
