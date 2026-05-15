import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError.js';

import { Prisma } from '@/generated/prisma/client.js';
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

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error(err);

    if (err.code === 'P2002') {
      return res.status(409).json({
        ok: false,
        message:
          'Já existe um registro com os dados informados (conflito de dados únicos).',
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        ok: false,
        message: 'O registro solicitado não foi encontrado.',
      });
    }

    return res.status(400).json({
      ok: false,
      message:
        'Ocorreu um erro de validação ou de banco de dados ao processar a requisição.',
    });
  }

  if (err instanceof Error) {
    return res.status(400).json({ ok: false, message: err.message });
  }

  console.error(err);

  return res.status(500).json({
    ok: false,
    message: 'Ocorreu um erro no servidor. Tente novamente.',
  });
}
