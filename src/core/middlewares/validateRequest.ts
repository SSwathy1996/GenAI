import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/ValidationError';

// Simple validator middleware factory. Expects a `validator` that returns { valid: boolean, errors?: any }
export function validateRequest(validator: (body: any) => { valid: boolean; errors?: any }) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = validator(req.body);
    if (!result.valid) {
      next(new ValidationError('Request validation failed', result.errors));
      return;
    }
    next();
  };
}

export default validateRequest;
