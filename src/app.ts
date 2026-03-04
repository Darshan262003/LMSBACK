import express from 'express';
import cookieParser from 'cookie-parser';
import { corsConfig, securityConfig, rateLimitConfig } from './config/security';
import { config } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import videoRoutes from './modules/videos/video.routes';
import progressRoutes from './modules/progress/progress.routes';
import healthRoutes from './modules/health/health.routes';

const app = express();

// Disable ETag for dynamic content to prevent 304 issues
app.set('etag', false);

// Middleware
app.use(corsConfig);
app.use((req, res, next) => {
  // Explicitly set CORS headers for all responses
  res.header('Access-Control-Allow-Origin', config.frontend.url);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Accept, Origin, X-Requested-With, Access-Control-Allow-Origin, Cache-Control, Pragma, Expires'
  );
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(securityConfig);
app.use(rateLimitConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/progress', progressRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
