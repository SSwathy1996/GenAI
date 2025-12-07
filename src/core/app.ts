import express from 'express';
import cors from 'cors';
import config from './config';
import { requestLogger, rateLimiter, errorHandler } from './middlewares';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Core middlewares
  app.use(requestLogger);
  app.use(rateLimiter);

  // Health endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Central error handler (must be last)
  app.use(errorHandler);

  return app;
}

export default createApp;
