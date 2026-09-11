import Stripe from 'stripe';

import { stripe } from '@/src/lib/stripe.js';

import { SubscriptionRepository } from '@/src/repositories/SubscriptionRepository.js';

function mapStripeStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case 'trialing':
      return 'TRIALING';
    case 'active':
      return 'ACTIVE';
    case 'past_due':
      return 'PAST_DUE';
    case 'paused':
      return 'PAUSED';
    default:
      return 'CANCELED';
  }
}

const BLOCKING_STATUSES = ['CANCELED', 'PAST_DUE', 'PAUSED'];

export class HandleStripeWebhookService {
  async execute(event: Stripe.Event) {
    const subscriptionRepository = new SubscriptionRepository();

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        const subscription = await subscriptionRepository.getByCustomerId(
          stripeSubscription.customer as string,
        );

        if (!subscription) return;

        const status = mapStripeStatus(stripeSubscription.status);

        await subscriptionRepository.updateByBarbershopId(
          subscription.barbershopId,
          {
            status,
          },
        );

        await subscriptionRepository.setBarbershopStatus(
          subscription.barbershopId,
          !BLOCKING_STATUSES.includes(status),
        );

        break;
      }

      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;

        if (!paymentMethod.customer) return;

        const subscription = await subscriptionRepository.getByCustomerId(
          paymentMethod.customer as string,
        );

        if (
          !subscription ||
          subscription.status !== 'PAUSED' ||
          !subscription.subscriptionId
        ) {
          return;
        }

        await stripe.subscriptions.resume(subscription.subscriptionId);

        break;
      }

      case 'customer.subscription.deleted': {
        const stripeSubscription = event.data.object as Stripe.Subscription;

        const subscription = await subscriptionRepository.getByCustomerId(
          stripeSubscription.customer as string,
        );

        if (!subscription) return;

        await subscriptionRepository.updateByBarbershopId(
          subscription.barbershopId,
          { status: 'CANCELED' },
        );

        await subscriptionRepository.setBarbershopStatus(
          subscription.barbershopId,
          false,
        );

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;

        const subscription = await subscriptionRepository.getByCustomerId(
          invoice.customer as string,
        );

        if (!subscription) return;

        await subscriptionRepository.updateByBarbershopId(
          subscription.barbershopId,
          { status: 'PAST_DUE' },
        );

        await subscriptionRepository.setBarbershopStatus(
          subscription.barbershopId,
          false,
        );

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;

        // Faturas de trial (ex: início do período gratuito) têm valor 0 e são
        // marcadas como pagas automaticamente pela Stripe, sem cobrança real.
        // O status correto da assinatura (trialing/active/etc.) já é
        // sincronizado via customer.subscription.updated.
        if (invoice.amount_paid === 0) return;

        const subscription = await subscriptionRepository.getByCustomerId(
          invoice.customer as string,
        );

        if (!subscription) return;

        await subscriptionRepository.updateByBarbershopId(
          subscription.barbershopId,
          { status: 'ACTIVE' },
        );

        await subscriptionRepository.setBarbershopStatus(
          subscription.barbershopId,
          true,
        );

        break;
      }

      default:
        break;
    }
  }
}
