import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateBarbershopController } from '../infrastructure/http/barbershops/CreateBarbershopController.js';
import { LoginBarbershopController } from '../infrastructure/http/barbershops/LoginBarbershopController.js';
import { DetailsBarbershopController } from '../infrastructure/http/barbershops/DetailsBarbershopController.js';
import { ForgotPasswordController } from '../infrastructure/http/barbershops/ForgotPasswordController.js';
import { ResetPasswordController } from '../infrastructure/http/barbershops/ResetPasswordController.js';

const router = Router();

router.post('/', CreateBarbershopController.handle);
router.post('/login', LoginBarbershopController.handle);
router.post('/forgot-password', ForgotPasswordController.handle);
router.post('/reset-password', ResetPasswordController.handle);

router.get('/me', verifyToken, DetailsBarbershopController.handle);

export default { baseUrl: '/barbershops', router };
