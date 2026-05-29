import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateServiceItemController } from '../controllers/service/CreateServiceItemController.js';
import { UpdateServiceItemController } from '../controllers/service/UpdateServiceItemController.js';
import { DeleteServiceItemController } from '../controllers/service/DeleteServiceItemController.js';

const router = Router();

router.post('/', verifyToken, CreateServiceItemController.handle);

router.put('/:id', verifyToken, UpdateServiceItemController.handle);

router.delete('/:id', verifyToken, DeleteServiceItemController.handle);

export default { baseUrl: '/services', router };
