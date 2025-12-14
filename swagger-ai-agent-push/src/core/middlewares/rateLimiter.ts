import { Request, Response, NextFunction } from 'express';

type RateEntry = { count: number; resetAt: number };

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 120;
const store = new Map<string, RateEntry>();

export function rateLimiter(req: Request, _res: Response, next: NextFunction) {
  const ip = (req.ip || req.headers['x-forwarded-for'] || 'anon') as string;
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (entry.count >= MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
    res.status(429).json({ error: 'Too many requests' });
    return;
  }

  entry.count += 1;
  store.set(ip, entry);
  next();
}

export default rateLimiter;
