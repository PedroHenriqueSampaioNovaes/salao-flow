import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyBarbershopStatus } from '../middlewares/verifyBarbershopStatus.js';

import { CreateCustomerController } from '../controllers/customer/CreateCustomerController.js';
import { UpdateCustomerController } from '../controllers/customer/UpdateCustomerController.js';
import { DeleteCustomerController } from '../controllers/customer/DeleteCustomerController.js';
import { ListCustomerController } from '../controllers/customer/ListCustomerController.js';

const router = Router();

router.post(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  CreateCustomerController.handle,
);

router.get(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  ListCustomerController.handle,
);

router.put(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  UpdateCustomerController.handle,
);

router.delete(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  DeleteCustomerController.handle,
);

export default { baseUrl: '/customers', router };
