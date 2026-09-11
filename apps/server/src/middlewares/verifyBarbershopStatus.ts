import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/src/errors/AppError.js';

import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

export async function verifyBarbershopStatus(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const barbershopRepository = new BarbershopRepository();

  const barbershop = await barbershopRepository.getStatusById(
    Number(req.barbershopId),
  );

  if (!barbershop?.status) {
    throw new AppError(
      'Assinatura inativa. Renove seu plano para continuar.',
      403,
    );
  }

  return next();
}
