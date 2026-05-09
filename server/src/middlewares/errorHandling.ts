import { NextFunction, Request, Response } from 'express';

export function errorHandling(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof Error) {
    return res.status(400).json({
      ok: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    ok: false,
    message: 'Ocorreu um erro no servidor. Tente novamente.',
  });
}
