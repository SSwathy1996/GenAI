import http from 'http';
import createApp from './app';
import config from './config';

let server: http.Server | null = null;

export async function startServer(): Promise<http.Server> {
  if (server) return server;
  const app = createApp();
  server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
  return server;
}

export async function stopServer(): Promise<void> {
  if (!server) return;
  await new Promise<void>((resolve, reject) => {
    server!.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
  server = null;
}

export default startServer;
