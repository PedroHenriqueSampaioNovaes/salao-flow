import { Request, Response } from 'express';

import { CreateRecruiterAccountService } from '@/src/services/barbershop/CreateRecruiterAccountService.js';

export class CreateRecruiterAccountController {
  static async handle(_req: Request, res: Response) {
    const createRecruiterAccountService = new CreateRecruiterAccountService();

    const result = await createRecruiterAccountService.execute();

    return res.status(201).json(result);
  }
}
