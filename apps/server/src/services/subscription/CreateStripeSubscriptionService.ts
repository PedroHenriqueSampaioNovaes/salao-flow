import { stripe } from '@/src/lib/stripe.js';

import { AppError } from '@/src/errors/AppError.js';

interface CreateStripeSubscriptionRequest {
  email: string;
  name: string;
}

export class CreateStripeSubscriptionService {
  async execute({ email, name }: CreateStripeSubscriptionRequest) {
    const priceId = process.env.STRIPE_PROFISSIONAL_PRICE_ID as string;
    const trialDays = Number(process.env.STRIPE_TRIAL_DAYS || 30);

    try {
      const customer = await stripe.customers.create({ email, name });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        trial_period_days: trialDays,
        trial_settings: {
          end_behavior: { missing_payment_method: 'pause' },
        },
        payment_behavior: 'default_incomplete',
      });

      if (!subscription.trial_end) {
        throw new Error('A assinatura criada não retornou uma data de fim de trial.');
      }

      return {
        customerId: customer.id,
        subscriptionId: subscription.id,
        priceId,
        trialEndsAt: new Date(subscription.trial_end * 1000),
      };
    } catch (err) {
      console.error(err);
      throw new AppError(
        'Não foi possível iniciar sua assinatura. Tente novamente.',
        502,
      );
    }
  }
}
