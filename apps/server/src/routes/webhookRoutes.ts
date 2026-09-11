import { Router } from 'express';

import { StripeWebhookController } from '../controllers/subscription/StripeWebhookController.js';

const router = Router();

router.post('/stripe', StripeWebhookController.handle);

export default { baseUrl: '/webhooks', router };
