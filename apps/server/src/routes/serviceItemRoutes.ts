import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyBarbershopStatus } from '../middlewares/verifyBarbershopStatus.js';

import { CreateServiceItemController } from '../controllers/service/CreateServiceItemController.js';
import { UpdateServiceItemController } from '../controllers/service/UpdateServiceItemController.js';
import { DeleteServiceItemController } from '../controllers/service/DeleteServiceItemController.js';
import { DetailsServiceItemController } from '../controllers/service/DetailsServiceItemController.js';
import { ListServiceItemController } from '../controllers/service/ListServiceItemController.js';

const router = Router();

router.post(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  CreateServiceItemController.handle,
);

router.get(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  DetailsServiceItemController.handle,
);
router.get(
  '/',
  verifyToken,
  verifyBarbershopStatus,
  ListServiceItemController.handle,
);

router.put(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  UpdateServiceItemController.handle,
);

router.delete(
  '/:id',
  verifyToken,
  verifyBarbershopStatus,
  DeleteServiceItemController.handle,
);

export default { baseUrl: '/services', router };
