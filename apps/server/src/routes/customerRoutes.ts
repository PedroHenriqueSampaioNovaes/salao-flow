import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateCustomerController } from '../controllers/customer/CreateCustomerController.js';
import { UpdateCustomerController } from '../controllers/customer/UpdateCustomerController.js';
import { DeleteCustomerController } from '../controllers/customer/DeleteCustomerController.js';
import { ListCustomerController } from '../controllers/customer/ListCustomerController.js';

const router = Router();

router.post('/', verifyToken, CreateCustomerController.handle);

router.get('/', verifyToken, ListCustomerController.handle);

router.put('/:id', verifyToken, UpdateCustomerController.handle);

router.delete('/:id', verifyToken, DeleteCustomerController.handle);

export default { baseUrl: '/customers', router };
