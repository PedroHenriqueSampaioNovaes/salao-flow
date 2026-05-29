import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateServiceItemController } from '../controllers/service/CreateServiceItemController.js';

const router = Router();

router.post('/', verifyToken, CreateServiceItemController.handle);

export default { baseUrl: '/services', router };
