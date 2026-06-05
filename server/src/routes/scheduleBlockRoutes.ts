import { Router } from 'express';

import { verifyToken } from '../middlewares/verifyToken.js';

import { CreateScheduleBlockController } from '../controllers/scheduleBlock/CreateScheduleBlockController.js';
import { DetailsScheduleBlockController } from '../controllers/scheduleBlock/DetailsScheduleBlockController.js';
import { ListScheduleBlockController } from '../controllers/scheduleBlock/ListScheduleBlockController.js';
import { DeleteScheduleBlockController } from '../controllers/scheduleBlock/DeleteScheduleBlockController.js';
import { UpdateScheduleBlockController } from '../controllers/scheduleBlock/UpdateScheduleBlockController.js';

const router = Router();

router.post('/', verifyToken, CreateScheduleBlockController.handle);

router.get('/:id', verifyToken, DetailsScheduleBlockController.handle);
router.get('/', verifyToken, ListScheduleBlockController.handle);

router.put('/:id', verifyToken, UpdateScheduleBlockController.handle);

router.delete('/:id', verifyToken, DeleteScheduleBlockController.handle);

export default { baseUrl: '/schedule-blocks', router };
