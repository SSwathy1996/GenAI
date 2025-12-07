import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    console.error('AppError:', err.message, err.details || '');
    res.status(err.status || 500).json({ error: err.message, details: err.details });
    return;
  }

  console.error('Unhandled Error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal Server Error' });
}

export default errorHandler;
