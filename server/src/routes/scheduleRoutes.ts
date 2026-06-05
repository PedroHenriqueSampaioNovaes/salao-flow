import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateScheduleBlockController } from '../controllers/scheduleBlock/CreateScheduleBlockController.js';

const router = Router();

router.post('/', verifyToken, CreateScheduleBlockController.handle);

export default { baseUrl: '/schedule-blocks', router };
