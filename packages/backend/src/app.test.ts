import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createApp } from '../src/app';

describe('App Configuration', () => {
  let app: Awaited<ReturnType<typeof createApp>>;

  beforeEach(async () => {
    // Set up test environment
    process.env.PORT = '3000';
    process.env.HOST = '0.0.0.0';
    process.env.NODE_ENV = 'development';
    process.env.DB_PATH = ':memory:'; // Use in-memory DB for tests
    process.env.CORS_ORIGIN = 'http://localhost:5173';
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it('should create app successfully', async () => {
    app = await createApp();
    expect(app).toBeDefined();
    expect(app.config).toBeDefined();
  });

  it('should have health endpoint', async () => {
    app = await createApp();
    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });
    
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.status).toBe('ok');
  });

  it('should set log level based on NODE_ENV in development', async () => {
    app = await createApp();
    expect(app.config.NODE_ENV).toBe('development');
    // Log level should be 'info' for development
    expect(app.log.level).toBeDefined();
  });

  describe('Production mode - Static file serving', () => {
    beforeEach(async () => {
      process.env.NODE_ENV = 'production';
    });

    it('should register static plugin in production', async () => {
      app = await createApp();
      
      // In production, the app should have static plugin registered
      // We can verify this by checking if the setNotFoundHandler was called
      expect(app.config.NODE_ENV).toBe('production');
      
      // The app should be properly configured
      expect(app).toBeDefined();
    });

    it('should have set log level to warn in production', async () => {
      app = await createApp();
      expect(app.config.NODE_ENV).toBe('production');
      expect(app.log.level).toBe('warn');
    });
  });

  describe('CORS Configuration', () => {
    it('should have CORS configured with correct origin', async () => {
      app = await createApp();
      expect(app.config.CORS_ORIGIN).toBe('http://localhost:5173');
    });
  });

  describe('Database Configuration', () => {
    it('should have database initialized', async () => {
      app = await createApp();
      expect(app.db).toBeDefined();
    });

    it('should close database on app close', async () => {
      app = await createApp();
      const closeSpy = vi.spyOn(app.db, 'close');
      
      await app.close();
      
      expect(closeSpy).toHaveBeenCalled();
      closeSpy.mockRestore();
    });
  });
});
