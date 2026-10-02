import { Request, Response } from 'express';

import { emitToBarbershop } from '../../lib/socket.js';

import { createAppointmentSchema } from '@sistema-barbearia/validators';

import { isAuthenticatedRequest } from '../../utils/isAuthenticatedRequest.js';

import { CreateAppointmentService } from '../../services/appointment/CreateAppointmentService.js';

export class CreateAppointmentController {
  static async handle(req: Request, res: Response) {
    const body = createAppointmentSchema.parse(req.body);

    const createAppointmentService = new CreateAppointmentService();

    const { appointment } = await createAppointmentService.execute(body, {
      isPanelRequest: isAuthenticatedRequest(req),
    });

    emitToBarbershop(body.barbershopSlug, 'new-appointment', appointment);

    return res.status(201).json(appointment);
  }
}
