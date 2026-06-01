import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateAppointmentController } from '../controllers/appointment/CreateAppointmentController.js';
import { ListAppointmentController } from '../controllers/appointment/ListAppointmentController.js';

const router = Router();

router.post('/', verifyToken, CreateAppointmentController.handle);

router.get('/', verifyToken, ListAppointmentController.handle);

export default { baseUrl: '/appointments', router };
