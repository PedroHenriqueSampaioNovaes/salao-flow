import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateAppointmentController } from '../controllers/appointment/CreateAppointmentController.js';
import { ListAppointmentController } from '../controllers/appointment/ListAppointmentController.js';
import { DeleteAppointmentController } from '../controllers/appointment/DeleteAppointmentController.js';

const router = Router();

router.post('/', verifyToken, CreateAppointmentController.handle);

router.get('/', verifyToken, ListAppointmentController.handle);

router.delete('/:id', verifyToken, DeleteAppointmentController.handle);

export default { baseUrl: '/appointments', router };
