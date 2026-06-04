import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateEmployeeScheduleController } from '../controllers/employeeSchedule/CreateEmployeeScheduleController.js';

const router = Router();

router.post('/', verifyToken, CreateEmployeeScheduleController.handle);

export default { baseUrl: '/employee-schedules', router };
