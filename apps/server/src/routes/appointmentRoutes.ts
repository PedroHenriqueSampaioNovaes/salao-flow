import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyBarbershopStatus } from '../middlewares/verifyBarbershopStatus.js';

import { CreateAppointmentController } from '../controllers/appointment/CreateAppointmentController.js';
import { ListAppointmentController } from '../controllers/appointment/ListAppointmentController.js';
import { DeleteAppointmentController } from '../controllers/appointment/DeleteAppointmentController.js';

const router = Router();

router.post('/', CreateAppointmentController.handle);

router.get(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  ListAppointmentController.handle,
);

router.delete(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  DeleteAppointmentController.handle,
);

export default { baseUrl: '/appointments', router };
