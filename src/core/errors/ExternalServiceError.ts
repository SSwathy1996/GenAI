import AppError from './AppError';

export class ExternalServiceError extends AppError {
  constructor(message = 'External service error', status = 502, details?: unknown) {
    super(message, status, details);
    this.name = 'ExternalServiceError';
  }
}

export default ExternalServiceError;
