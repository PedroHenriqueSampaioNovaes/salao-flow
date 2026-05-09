import { Request, Response } from 'express';

export function errorHandling(err: any, _: Request, res: Response) {
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
