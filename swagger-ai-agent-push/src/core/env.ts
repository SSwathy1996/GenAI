import dotenv from 'dotenv';

// Load .env when present. The user said they will edit .env as needed.
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
};

export type Env = typeof env;
