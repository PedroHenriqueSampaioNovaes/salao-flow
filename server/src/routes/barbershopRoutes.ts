import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateBarbershopController } from '../infrastructure/http/barbershops/CreateBarbershopController.js';
import { LoginBarbershopController } from '../infrastructure/http/barbershops/LoginBarbershopController.js';
import { DetailsBarbershopController } from '../infrastructure/http/barbershops/DetailsBarbershopController.js';

const router = Router();

router.post('/', CreateBarbershopController.handle);
router.post('/login', LoginBarbershopController.handle);

router.get('/me', verifyToken, DetailsBarbershopController.handle);

export default { baseUrl: '/barbershops', router };
