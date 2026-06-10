import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateServiceItemController } from '../controllers/service/CreateServiceItemController.js';
import { UpdateServiceItemController } from '../controllers/service/UpdateServiceItemController.js';
import { DeleteServiceItemController } from '../controllers/service/DeleteServiceItemController.js';
import { DetailsServiceItemController } from '../controllers/service/DetailsServiceItemController.js';
import { ListServiceItemController } from '../controllers/service/ListServiceItemController.js';

const router = Router();

router.post('/', verifyToken, CreateServiceItemController.handle);

router.get('/:id', verifyToken, DetailsServiceItemController.handle);
router.get('/', verifyToken, ListServiceItemController.handle);

router.put('/:id', verifyToken, UpdateServiceItemController.handle);

router.delete('/:id', verifyToken, DeleteServiceItemController.handle);

export default { baseUrl: '/services', router };
