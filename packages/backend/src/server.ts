import { createApp } from './app.js';

/**
 * Server entry point
 * Starts the Fastify server and handles graceful shutdown
 */
async function start() {
  try {
    const app = await createApp();

    // Start server
    await app.listen({
      port: app.config.PORT,
      host: app.config.HOST
    });

    app.log.info(
      `Server listening on http://${app.config.HOST}:${app.config.PORT}`
    );
    app.log.info(
      `Swagger documentation available at http://${app.config.HOST}:${app.config.PORT}/docs`
    );

    // Graceful shutdown handlers
    const signals = ['SIGTERM', 'SIGINT'] as const;
    
    for (const signal of signals) {
      process.on(signal, async () => {
        app.log.info(`Received ${signal}, closing server gracefully...`);
        await app.close();
        process.exit(0);
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
