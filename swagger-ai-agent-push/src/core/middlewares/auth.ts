import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function auth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(new AppError('Unauthorized', 401));
    return;
  }
  // For Phase 1 we accept any Bearer token; future phases will validate properly
  next();
}

export default auth;
