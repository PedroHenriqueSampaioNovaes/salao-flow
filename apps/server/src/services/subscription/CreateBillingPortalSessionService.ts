import { stripe } from '@/src/lib/stripe.js';

import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

export class CreateBillingPortalSessionService {
  async execute(barbershopId: number) {
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);

    if (!barbershop?.customerId) {
      throw new AppError('Nenhuma assinatura encontrada.', 404);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: barbershop.customerId,
      return_url: `${process.env.FRONTEND_URL}/panel/subscription-view`,
    });

    return { url: session.url };
  }
}
