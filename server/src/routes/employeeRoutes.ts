import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateEmployeeController } from '../controllers/employee/CreateEmployeeController.js';
import { UpdateEmployeeController } from '../controllers/employee/UpdateEmployeeController.js';
import { DetailsEmployeeController } from '../controllers/employee/DetailsEmployeeController.js';

const router = Router();

router.post('/', verifyToken, CreateEmployeeController.handle);

router.get('/:id', verifyToken, DetailsEmployeeController.handle);

router.put('/:id', verifyToken, UpdateEmployeeController.handle);

export default { baseUrl: '/employees', router };
