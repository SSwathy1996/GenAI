import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  const now = new Date().toISOString();
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  console.log(`[${now}] ${req.method} ${req.originalUrl} - ${String(ip)}`);
  next();
}

export default requestLogger;
