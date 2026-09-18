import { Router } from 'express';

import { verifyCronSecret } from '../middlewares/verifyCronSecret.js';

import { DeleteOldAppointmentsController } from '../controllers/appointment/DeleteOldAppointmentsController.js';
import { DeleteExpiredRecruiterAccountsController } from '../controllers/barbershop/DeleteExpiredRecruiterAccountsController.js';

const router = Router();

router.get(
  '/cleanup-old-appointments',
  verifyCronSecret,
  DeleteOldAppointmentsController.handle,
);

router.get(
  '/cleanup-expired-recruiter-accounts',
  verifyCronSecret,
  DeleteExpiredRecruiterAccountsController.handle,
);

export default { baseUrl: '/cron', router };
