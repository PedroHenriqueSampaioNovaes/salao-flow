import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';

import { ZodError } from '@sistema-barbearia/validators';

export function errorHandling(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ok: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(422).json({
      ok: false,
      message: err.issues[0].message,
    });
  }

  console.error(err);

  return res.status(500).json({
    ok: false,
    message: 'Ocorreu um erro no servidor. Tente novamente.',
  });
}
