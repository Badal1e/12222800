import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import logger from '../logging-middleware/logger.mjs';
import urlRoutes from './routes/urlRoutes.js';
import { redirectHandler } from './controllers/redirectController.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize logger with your credentials
// Note: Replace these with your actual credentials from registration
const CLIENT_ID = 'your-client-id-here';
const CLIENT_SECRET = 'your-client-secret-here';

// Initialize logger
logger.init(CLIENT_ID, CLIENT_SECRET).then(() => {
  logger.log('backend', 'info', 'config', 'Logger initialized successfully');
}).catch(error => {
  console.error('Logger initialization failed:', error);
});

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Request logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  logger.log('backend', 'info', 'handler', 'Health check endpoint accessed');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// URL shortening routes
app.use('/shorturls', urlRoutes);

// Redirect handler for short URLs
app.get('/:shortcode', redirectHandler);

// Global error handler
app.use((err, req, res, next) => {
  logger.log('backend', 'error', 'handler', `Global error: ${err.message}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: true,
    message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  logger.log('backend', 'warn', 'handler', `404 - Route not found: ${req.path}`);
  res.status(404).json({
    error: true,
    message: 'Route not found',
    timestamp: new Date().toISOString()
  });
});

// Start server
const server = createServer(app);
server.listen(PORT, () => {
  logger.log('backend', 'info', 'config', `Server started on port ${PORT}`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.log('backend', 'info', 'config', 'Received SIGTERM, shutting down gracefully');
  server.close(() => {
    logger.log('backend', 'info', 'config', 'Server shut down successfully');
  });
});

export default app;