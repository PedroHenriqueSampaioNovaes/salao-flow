import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateAppointmentController } from '../controllers/appointment/CreateAppointmentController.js';

const router = Router();

router.post('/', verifyToken, CreateAppointmentController.handle);

export default { baseUrl: '/appointments', router };
