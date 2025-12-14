#!/usr/bin/env node
import startServer from '../core/server';

async function main() {
  try {
    await startServer();
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('SIGINT received, shutting down');
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received, shutting down');
      process.exit(0);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
