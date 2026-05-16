import { NextFunction, Request, Response } from 'express';

import { JwtTokenAdapter } from '@/src/infrastructure/Providers/JwtTokenAdapter.js';
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
    const jwtTokenAdapter = new JwtTokenAdapter();

    const decoded = jwtTokenAdapter.verify(token) as TokenPayload;

    req.barbershopId = decoded.id;

    return next();
  } catch {
    throw new AppError('Token inválido ou expirado.', 401);
  }
}
