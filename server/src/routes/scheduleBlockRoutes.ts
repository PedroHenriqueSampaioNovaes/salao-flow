import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateScheduleBlockController } from '../controllers/scheduleBlock/CreateScheduleBlockController.js';
import { DetailsScheduleBlockController } from '../controllers/scheduleBlock/DetailsScheduleBlockController.js';
import { ListScheduleBlockController } from '../controllers/scheduleBlock/ListScheduleBlockController.js';

const router = Router();

router.post('/', verifyToken, CreateScheduleBlockController.handle);

router.get('/:id', verifyToken, DetailsScheduleBlockController.handle);
router.get('/', verifyToken, ListScheduleBlockController.handle);

export default { baseUrl: '/schedule-blocks', router };
