import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';
import { verifyBarbershopStatus } from '../middlewares/verifyBarbershopStatus.js';

import { CreateBarbershopController } from '../controllers/barbershop/CreateBarbershopController.js';
import { CreateRecruiterAccountController } from '../controllers/barbershop/CreateRecruiterAccountController.js';
import { LoginBarbershopController } from '../controllers/barbershop/LoginBarbershopController.js';
import { DetailsBarbershopController } from '../controllers/barbershop/DetailsBarbershopController.js';
import { ForgotPasswordController } from '../controllers/barbershop/ForgotPasswordController.js';
import { ResetPasswordController } from '../controllers/barbershop/ResetPasswordController.js';
import { UpdateBarbershopController } from '../controllers/barbershop/UpdateBarbershopController.js';
import { GetBookingInfoController } from '../controllers/barbershop/GetBookingInfoController.js';
import { GetAvailableSlotsController } from '../controllers/barbershop/GetAvailableSlotsController.js';
import { GetDashboardMetricsController } from '../controllers/barbershop/GetDashboardMetricsController.js';

const router = Router();

router.post('/', CreateBarbershopController.handle);
router.post('/recruiter', CreateRecruiterAccountController.handle);
router.post('/login', LoginBarbershopController.handle);
router.post('/forgot-password', ForgotPasswordController.handle);
router.post('/reset-password', ResetPasswordController.handle);

router.get('/:slug/booking', GetBookingInfoController.handle);
router.get('/:slug/available-slots', GetAvailableSlotsController.handle);
router.get('/me', verifyToken, DetailsBarbershopController.handle);
router.get(
  '/me/dashboard-metrics',
  verifyToken,
  verifyBarbershopStatus,
  GetDashboardMetricsController.handle,
);

router.put('/', verifyToken, UpdateBarbershopController.handle);

export default { baseUrl: '/barbershops', router };
