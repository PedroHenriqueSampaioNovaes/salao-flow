import { prisma } from '@/src/lib/prisma.js';
import { Barbershop, Subscription } from '@/generated/prisma/client.js';

import { CreateBarbershop } from '@/src/interfaces/Barbershop.js';

interface UpdateBarbershop extends Partial<Barbershop> {
  subscription: Partial<Subscription>;
}

export class BarbershopRepository {
  async create(data: CreateBarbershop) {
    const barbershop = await prisma.barbershop.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address,
        phone: data.phone,
        image: data.image,
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
        operatingTimes: {
          create: [
            {
              name: 'Horário Padrão',
              start: '08:00',
              startLunch: '12:00',
              endLunch: '13:00',
              end: '18:00',
            },
          ],
        },
      },
    });

    return barbershop;
  }

  async getByEmail(email: string) {
    const barbershop = await prisma.barbershop.findUnique({
      where: { email },
      include: { subscription: true },
    });

    return barbershop;
  }

  async getById(id: number) {
    const barbershop = await prisma.barbershop.findUnique({
      where: { id },
      omit: {
        password: true,
        updatedAt: true,
        customerId: true,
        resetPasswordExpires: true,
        resetPasswordToken: true,
      },
    });

    return barbershop;
  }

  async getByResetToken(token: string) {
    const barbershop = await prisma.barbershop.findUnique({
      where: { resetPasswordToken: token },
    });

    return barbershop;
  }

  async updateProfile(id: number, data: Partial<UpdateBarbershop>) {
    const barbershop = await prisma.barbershop.update({
      where: { id },
      data: {
        ...data,
        subscription: {
          update: {
            status: data.subscription?.status,
          },
        },
      },
      omit: {
        id: true,
        password: true,
        createdAt: true,
        updatedAt: true,
        customerId: true,
        status: true,
        resetPasswordExpires: true,
        resetPasswordToken: true,
      },
    });

    return barbershop;
  }
}
