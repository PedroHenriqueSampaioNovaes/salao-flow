import { Request, Response } from 'express';

import {
  BarbershopSchema,
  EmployeeSchema,
  z,
} from '@sistema-barbearia/validators';

const CreateBarbershopWithEmployeesSchema = BarbershopSchema.and(
  z.object({
    employees: z.array(EmployeeSchema, 'Adicione pelo menos 1 profissional.'),
  }),
);

import { PrismaBarbershopAdapter } from '@/src/infrastructure/database/PrismaBarbershopAdapter.js';
import { BcryptHashAdapter } from '@/src/infrastructure/Providers/BcryptHashAdapter.js';
import { CreateBarbershopService } from '@/src/domain/services/barbershop/CreateBarbershopService.js';

export class CreateBarbershopController {
  static async handle(req: Request, res: Response) {
    const body = CreateBarbershopWithEmployeesSchema.parse(req.body);

    const prismaBarbershopAdapter = new PrismaBarbershopAdapter();
    const bcryptHashAdapter = new BcryptHashAdapter();

    const createBarbershopService = new CreateBarbershopService(
      prismaBarbershopAdapter,
      bcryptHashAdapter,
    );

    const barbershop = await createBarbershopService.execute(body);

    return res.status(201).json(barbershop);
  }
}
