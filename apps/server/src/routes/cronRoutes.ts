import { Router } from 'express';

import { verifyCronSecret } from '../middlewares/verifyCronSecret.js';

import { DeleteOldAppointmentsController } from '../controllers/appointment/DeleteOldAppointmentsController.js';

const router = Router();

router.get(
  '/cleanup-old-appointments',
  verifyCronSecret,
  DeleteOldAppointmentsController.handle,
);

export default { baseUrl: '/cron', router };
