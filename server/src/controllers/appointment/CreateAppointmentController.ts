import { Request, Response } from 'express';

import {
  CreateAppointmentSchema,
  CreateCustomerSchema,
} from '@sistema-barbearia/validators';

import { CreateAppointmentService } from '../../services/appointment/CreateAppointmentService.js';

export class CreateAppointmentController {
  static async handle(req: Request, res: Response) {
    const body = CreateAppointmentSchema.extend(
      CreateCustomerSchema.shape,
    ).parse(req.body);

    const createAppointmentService = new CreateAppointmentService();

    const appointment = await createAppointmentService.execute(body);

    return res.status(201).json(appointment);
  }
}
