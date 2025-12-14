import { env } from './env';
import { AppConfig } from './types';

export const config: AppConfig = {
  port: env.port,
  nodeEnv: env.nodeEnv,
  baseUrl: env.baseUrl,
};

export default config;
