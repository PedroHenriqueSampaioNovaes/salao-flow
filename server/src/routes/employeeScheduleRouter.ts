import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateEmployeeScheduleController } from '../controllers/employeeSchedule/CreateEmployeeScheduleController.js';
import { UpdateEmployeeScheduleController } from '../controllers/employeeSchedule/UpdateEmployeeScheduleController.js';

const router = Router();

router.post('/', verifyToken, CreateEmployeeScheduleController.handle);

router.put('/:id', verifyToken, UpdateEmployeeScheduleController.handle);

export default { baseUrl: '/employee-schedules', router };
