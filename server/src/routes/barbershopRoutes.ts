import { Router } from 'express';

import { CreateBarbershopController } from '../infrastructure/http/barbershops/CreateBarbershopController.js';
import { LoginBarbershopController } from '../infrastructure/http/barbershops/LoginBarbershopController.js';

const router = Router();

router.post('/', CreateBarbershopController.handle);
router.post('/login', LoginBarbershopController.handle);

export default { baseUrl: '/barbershops', router };
