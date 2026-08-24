import { Request, Response } from 'express';

import { emitToBarbershop } from '../../lib/socket.js';

import { createAppointmentSchema } from '@sistema-barbearia/validators';

import { CreateAppointmentService } from '../../services/appointment/CreateAppointmentService.js';
import { GetDashboardMetricsService } from '../../services/barbershop/GetDashboardMetricsService.js';

export class CreateAppointmentController {
  static async handle(req: Request, res: Response) {
    const body = createAppointmentSchema.parse(req.body);

    const createAppointmentService = new CreateAppointmentService();

    const { appointment, barbershopId } =
      await createAppointmentService.execute(body);

    const dashboardMetrics = await new GetDashboardMetricsService().execute(
      barbershopId,
    );

    emitToBarbershop(body.barbershopSlug, 'new-appointment', {
      appointment,
      dashboardMetrics,
    });

    return res.status(201).json(appointment);
  }
}
