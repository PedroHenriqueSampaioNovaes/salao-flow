import { NextFunction, Request, Response } from 'express';

import { AppError } from '@/src/errors/AppError.js';

export function verifyCronSecret(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    throw new AppError('Não autorizado.', 401);
  }

  return next();
}
