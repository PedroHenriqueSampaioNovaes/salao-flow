import { stripe } from '@/src/lib/stripe.js';

import { AppError } from '@/src/errors/AppError.js';

import { SubscriptionRepository } from '@/src/repositories/SubscriptionRepository.js';

export class GetSubscriptionService {
  async execute(barbershopId: number) {
    const subscriptionRepository = new SubscriptionRepository();

    const subscription =
      await subscriptionRepository.getByBarbershopId(barbershopId);

    if (!subscription) {
      throw new AppError('Nenhuma assinatura encontrada.', 404);
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.subscriptionId,
    );

    const item = stripeSubscription.items.data[0];

    return {
      plan: subscription.plan,
      status: subscription.status,
      price: (item.price.unit_amount ?? 0) / 100,
      currentPeriodEnd: new Date(item.current_period_end * 1000),
    };
  }
}
