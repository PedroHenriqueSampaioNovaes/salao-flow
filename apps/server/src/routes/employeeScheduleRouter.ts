import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyBarbershopStatus } from '../middlewares/verifyBarbershopStatus.js';

import { CreateEmployeeScheduleController } from '../controllers/employeeSchedule/CreateEmployeeScheduleController.js';
import { UpdateEmployeeScheduleController } from '../controllers/employeeSchedule/UpdateEmployeeScheduleController.js';
import { DetailsEmployeeScheduleController } from '../controllers/employeeSchedule/DetailsEmployeeScheduleController.js';
import { ListEmployeeScheduleController } from '../controllers/employeeSchedule/ListEmployeeScheduleController.js';
import { DeleteEmployeeScheduleController } from '../controllers/employeeSchedule/DeleteEmployeeScheduleController.js';

const router = Router();

router.post(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  CreateEmployeeScheduleController.handle,
);

router.get(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  DetailsEmployeeScheduleController.handle,
);
router.get(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  ListEmployeeScheduleController.handle,
);

router.put(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  UpdateEmployeeScheduleController.handle,
);

router.delete(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  DeleteEmployeeScheduleController.handle,
);

export default { baseUrl: '/employee-schedules', router };
