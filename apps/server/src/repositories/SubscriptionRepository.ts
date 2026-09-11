import { prisma } from '@/src/lib/prisma.js';

interface UpdateSubscriptionData {
  status?: string;
  subscriptionId?: string;
  trialEndsAt?: Date | null;
  priceId?: string;
}

export class SubscriptionRepository {
  async getByBarbershopId(barbershopId: number) {
    const subscription = await prisma.subscription.findUnique({
      where: { barbershopId },
    });

    return subscription;
  }

  async getByCustomerId(customerId: string) {
    const subscription = await prisma.subscription.findFirst({
      where: { barbershop: { customerId } },
      include: { barbershop: true },
    });

    return subscription;
  }

  async updateByBarbershopId(
    barbershopId: number,
    data: UpdateSubscriptionData,
  ) {
    await prisma.subscription.update({
      where: { barbershopId },
      data: {
        status: data.status,
      },
    });
  }

  async setBarbershopStatus(barbershopId: number, status: boolean) {
    await prisma.barbershop.update({
      where: { id: barbershopId },
      data: { status },
    });
  }
}
