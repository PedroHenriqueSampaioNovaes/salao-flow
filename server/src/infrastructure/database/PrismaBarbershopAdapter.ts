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
      include: {
        employees: {
          include: {
            appointments: true,
          },
        },
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
      resetPasswordToken: prismaBarbershop.resetPasswordToken,
      resetPasswordExpires: prismaBarbershop.resetPasswordExpires,
      employees: prismaBarbershop.employees,
    });
  }

  async findById(id: number) {
    const prismaBarbershop = await prisma.barbershop.findUnique({
      where: { id },
      include: {
        employees: {
          include: {
            appointments: true,
          },
        },
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
      resetPasswordToken: prismaBarbershop.resetPasswordToken,
      resetPasswordExpires: prismaBarbershop.resetPasswordExpires,
      employees: prismaBarbershop.employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        image: employee.image,
        times: employee.times,
        appointments: employee.appointments.map((appointment) => ({
          id: appointment.id,
          name: appointment.name,
          phone: appointment.phone,
          date: appointment.date,
          time: appointment.time,
        })),
      })),
    });
  }

  async update(barbershop: Barbershop) {
    await prisma.barbershop.update({
      where: { id: barbershop.id },
      data: {
        name: barbershop.name,
        email: barbershop.email,
        password: barbershop.password,
        phone: barbershop.phone,
        address: barbershop.address,
        status: barbershop.status,
        image: barbershop.image,
        customerId: barbershop.customerId,
        resetPasswordToken: barbershop.resetPasswordToken,
        resetPasswordExpires: barbershop.resetPasswordExpires,
      },
    });
  }

  async findByResetToken(token: string) {
    const prismaBarbershop = await prisma.barbershop.findFirst({
      where: { resetPasswordToken: token },
      include: {
        employees: {
          include: {
            appointments: true,
          },
        },
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
      resetPasswordToken: prismaBarbershop.resetPasswordToken,
      resetPasswordExpires: prismaBarbershop.resetPasswordExpires,
      employees: prismaBarbershop.employees.map((employee) => ({
        id: employee.id,
        name: employee.name,
        image: employee.image,
        times: employee.times,
        appointments: employee.appointments.map((appointment) => ({
          id: appointment.id,
          name: appointment.name,
          phone: appointment.phone,
          date: appointment.date,
          time: appointment.time,
        })),
      })),
    });
  }
}
