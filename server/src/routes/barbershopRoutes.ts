import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateBarbershopController } from '../controllers/barbershop/CreateBarbershopController.js';
import { LoginBarbershopController } from '../controllers/barbershop/LoginBarbershopController.js';
import { DetailsBarbershopController } from '../controllers/barbershop/DetailsBarbershopController.js';
import { ForgotPasswordController } from '../controllers/barbershop/ForgotPasswordController.js';
import { ResetPasswordController } from '../controllers/barbershop/ResetPasswordController.js';
import { UpdateBarbershopController } from '../controllers/barbershop/UpdateBarbershopController.js';
import { GetBookingInfoController } from '../controllers/barbershop/GetBookingInfoController.js';

const router = Router();

router.post('/', CreateBarbershopController.handle);
router.post('/login', LoginBarbershopController.handle);
router.post('/forgot-password', ForgotPasswordController.handle);
router.post('/reset-password', ResetPasswordController.handle);

router.get('/:slug/booking', GetBookingInfoController.handle);
router.get('/me', verifyToken, DetailsBarbershopController.handle);

router.put('/', verifyToken, UpdateBarbershopController.handle);

export default { baseUrl: '/barbershops', router };
