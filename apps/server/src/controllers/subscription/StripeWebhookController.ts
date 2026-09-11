import { Request, Response } from 'express';

import { stripe } from '@/src/lib/stripe.js';

import { HandleStripeWebhookService } from '@/src/services/subscription/HandleStripeWebhookService.js';

export class StripeWebhookController {
  static async handle(req: Request, res: Response) {
    const signature = req.headers['stripe-signature'];

    if (!signature) {
      return res.status(400).json({ ok: false, message: 'Assinatura ausente.' });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (error) {
      console.error('Falha ao verificar assinatura do webhook Stripe:', error);
      return res.status(400).json({ ok: false, message: 'Assinatura inválida.' });
    }

    try {
      await new HandleStripeWebhookService().execute(event);
    } catch (error) {
      console.error(error);
    }

    return res.status(200).json({ received: true });
  }
}
