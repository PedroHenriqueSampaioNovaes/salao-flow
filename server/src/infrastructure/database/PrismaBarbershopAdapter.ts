import { prisma } from '@/lib/prisma.js';

import { Barbershop } from '../../domain/entities/Barbershop.js';
import { BarbershopRepository } from '../../domain/repositories/BarbershopRepository.js';
import { CreateBarbershopRequest } from '@/src/types/CreateBarbershopRequest.js';

export class PrismaBarbershopAdapter implements BarbershopRepository {
  async create(barbershop: CreateBarbershopRequest) {
    await prisma.barbershop.create({
      data: {
        name: barbershop.name,
        email: barbershop.email,
        password: barbershop.password,
        phone: barbershop.phone,
        address: barbershop.address,
        employees: {
          create: barbershop.employees,
        },
      },
    });
  }

  async findByEmail(email: string) {
    const prismaBarbershop = await prisma.barbershop.findUnique({
      where: {
        email,
      },
    });

    if (!prismaBarbershop) return null;

    return new Barbershop({
      id: prismaBarbershop.id,
      name: prismaBarbershop.name,
      email: prismaBarbershop.email,
      password: prismaBarbershop.password,
      customerId: prismaBarbershop.customerId,
      address: prismaBarbershop.address,
      phone: prismaBarbershop.phone,
      status: prismaBarbershop.status,
      image: prismaBarbershop.image,
    });
  }
}
