import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateEmployeeScheduleController } from '../controllers/employeeSchedule/CreateEmployeeScheduleController.js';
import { UpdateEmployeeScheduleController } from '../controllers/employeeSchedule/UpdateEmployeeScheduleController.js';
import { DetailsEmployeeScheduleController } from '../controllers/employeeSchedule/DetailsEmployeeScheduleController.js';
import { ListEmployeeScheduleController } from '../controllers/employeeSchedule/ListEmployeeScheduleController.js';

const router = Router();

router.post('/', verifyToken, CreateEmployeeScheduleController.handle);

router.get('/:id', verifyToken, DetailsEmployeeScheduleController.handle);
router.get('/', verifyToken, ListEmployeeScheduleController.handle);

router.put('/:id', verifyToken, UpdateEmployeeScheduleController.handle);

export default { baseUrl: '/employee-schedules', router };
