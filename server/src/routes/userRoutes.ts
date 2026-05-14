import { Router } from 'express';

import { CreateUserController } from '../infrastructure/http/users/CreateUserController.js';

const router = Router();

router.post('/', CreateUserController.handle);

export default { baseUrl: '/users', router };
