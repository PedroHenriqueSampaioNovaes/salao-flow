import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyBarbershopStatus } from '../middlewares/verifyBarbershopStatus.js';

import { CreateEmployeeController } from '../controllers/employee/CreateEmployeeController.js';
import { UpdateEmployeeController } from '../controllers/employee/UpdateEmployeeController.js';
import { DetailsEmployeeController } from '../controllers/employee/DetailsEmployeeController.js';
import { ListBarbershopEmployeeController } from '../controllers/employee/ListBarbershopEmployeeController.js';
import { DeleteEmployeeController } from '../controllers/employee/DeleteEmployeeController.js';

const router = Router();

router.post(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  CreateEmployeeController.handle,
);

router.get(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  ListBarbershopEmployeeController.handle,
);
router.get(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  DetailsEmployeeController.handle,
);

router.put(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  UpdateEmployeeController.handle,
);

router.delete(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  DeleteEmployeeController.handle,
);

export default { baseUrl: '/employees', router };
