import { Router } from 'express';

import { CreateUserController } from '../infrastructure/http/users/CreateUserController.js';
import { LoginUserController } from '../infrastructure/http/users/LoginUserController.js';

const router = Router();

router.post('/', CreateUserController.handle);
router.post('/login', LoginUserController.handle);

export default { baseUrl: '/users', router };
