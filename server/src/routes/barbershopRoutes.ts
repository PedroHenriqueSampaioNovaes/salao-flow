import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateBarbershopController } from '../controllers/barbershop/CreateBarbershopController.js';
import { LoginBarbershopController } from '../controllers/barbershop/LoginBarbershopController.js';
import { DetailsBarbershopController } from '../controllers/barbershop/DetailsBarbershopController.js';
import { ForgotPasswordController } from '../controllers/barbershop/ForgotPasswordController.js';
import { ResetPasswordController } from '../controllers/barbershop/ResetPasswordController.js';

const router = Router();

router.post('/', CreateBarbershopController.handle);
router.post('/login', LoginBarbershopController.handle);
router.post('/forgot-password', ForgotPasswordController.handle);
router.post('/reset-password', ResetPasswordController.handle);

router.get('/me', verifyToken, DetailsBarbershopController.handle);

export default { baseUrl: '/barbershops', router };
