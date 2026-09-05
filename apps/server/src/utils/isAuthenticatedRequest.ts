import { Request } from 'express';
import jwt from 'jsonwebtoken';

export function isAuthenticatedRequest(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) return false;

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return true;
  } catch {
    return false;
  }
}
