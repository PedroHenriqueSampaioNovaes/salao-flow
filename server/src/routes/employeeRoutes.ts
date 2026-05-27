import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateEmployeeController } from '../controllers/employee/CreateEmployeeController.js';

const router = Router();

router.post('/', verifyToken, CreateEmployeeController.handle);

export default { baseUrl: '/employees', router };
