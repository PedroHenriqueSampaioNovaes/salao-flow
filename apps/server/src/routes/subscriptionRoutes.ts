import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateBillingPortalSessionController } from '../controllers/subscription/CreateBillingPortalSessionController.js';
import { GetSubscriptionController } from '../controllers/subscription/GetSubscriptionController.js';

const router = Router();

router.get('/me', verifyToken, GetSubscriptionController.handle);

router.post(
  '/billing-portal',
  verifyToken,
  CreateBillingPortalSessionController.handle,
);

export default { baseUrl: '/subscriptions', router };
