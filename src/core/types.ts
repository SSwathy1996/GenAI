export type AppConfig = {
  port: number;
  nodeEnv: string;
  baseUrl?: string;
};

export interface HttpError extends Error {
  status?: number;
}
