import { prisma } from '@/src/lib/prisma.js';
import { Barbershop, Subscription } from '@/generated/prisma/client.js';

import { CreateBarbershop } from '../interfaces/Barbershop.js';

interface UpdateBarbershop extends Partial<Barbershop> {
  subscription: Partial<Subscription>;
}

const employeeScheduleWeekdays = Array.from({ length: 7 }).map((_, index) => ({
  weekday: index || 7,
  start: '08:00',
  startLunch: '12:00',
  endLunch: '13:00',
  end: '18:00',
}));

export class BarbershopRepository {
  async create(data: CreateBarbershop) {
    const barbershop = await prisma.barbershop.create({
      data: {
        name: data.name,
        businessName: data.businessName,
        email: data.email,
        password: data.password,
        address: data.address,
        phone: data.phone,
        image: data.image,
        slug: data.slug!,
        timezone: data.timezone,
        subscription: {
          create: {
            plan: 'FREE',
            status: 'ACTIVE',
          },
        },
        employeeSchedules: {
          create: [
            {
              name: 'Horários de Expediente Padrão',
              isDefault: true,
              employeeScheduleWeekdays: {
                create: employeeScheduleWeekdays,
              },
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

  async getBySlug(slug: string) {
    const barbershop = await prisma.barbershop.findUnique({
      where: { slug },
    });

    return barbershop;
  }

  async getById(id: number) {
    const barbershop = await prisma.barbershop.findUnique({
      where: { id },
      omit: {
        updatedAt: true,
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
        name: data.name,
        businessName: data.businessName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        image: data.image,
        slug: data.slug,
        timezone: data.timezone,
        whatsAppUrl: data.whatsAppUrl,
        facebookUrl: data.facebookUrl,
        instagramUrl: data.instagramUrl,
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

  async getDashboardData(id: number, todayStart: Date, todayEnd: Date) {
    const barbershop = await prisma.barbershop.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            customers: true,
            employees: true,
            services: true,
            appointments: {
              where: {
                date: {
                  gte: todayStart,
                  lte: todayEnd,
                },
              },
            },
          },
        },
      },
    });

    return barbershop;
  }

  async getBookingInfoBySlug(slug: string, now: string, maxDate: string) {
    const barbershop = await prisma.barbershop.findUnique({
      where: { slug },
      include: {
        employees: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            name: true,
            image: true,
            services: {
              where: { status: true },
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                duration: true,
              },
            },
            employeeSchedule: {
              select: {
                employeeScheduleWeekdays: {
                  select: {
                    weekday: true,
                    isWorkingDay: true,
                    start: true,
                    startLunch: true,
                    endLunch: true,
                    end: true,
                  },
                },
              },
            },
            scheduleBlocks: {
              where: {
                finalDate: { gte: now },
              },
              select: {
                initialDate: true,
                finalDate: true,
              },
            },
            appointments: {
              where: {
                date: {
                  gte: now,
                  lte: maxDate,
                },
              },
              select: {
                date: true,
                totalServiceDuration: true,
              },
            },
          },
        },
      },
    });

    return barbershop;
  }
}
