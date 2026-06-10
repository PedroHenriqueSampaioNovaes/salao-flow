import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

import { AppError } from '@/src/errors/AppError.js';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      barbershopId: string;
    }
  }
}

export function verifyToken(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token não fornecido.', 401);
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new AppError('Token mal formatado.', 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenPayload;

    req.barbershopId = decoded.id;

    return next();
  } catch {
    throw new AppError('Token inválido ou expirado.', 401);
  }
}
