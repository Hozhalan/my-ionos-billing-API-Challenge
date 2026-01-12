/**
 * Mock Server for IONOS Billing API
 *
 * This server emulates the IONOS Billing API responses for testing purposes.
 * It handles authentication, various endpoints, and rate limiting for the utilization endpoint.
 *
 * @module mock-server/server
 */

const express = require('express');
const config = require('../config');
const middleware = require('./middleware');
const { setupRoutes } = require('./routes');
const { createErrorResponse } = require('../tests/helpers/validators');

const app = express();

// Trust proxy for accurate IP addresses (useful for rate limiting)
app.set('trust proxy', true);

// Middleware to parse JSON
app.use(express.json());

/**
 * Request timeout middleware
 * Sets timeout for both request and response
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((req, res, next) => {
  req.setTimeout(config.server.requestTimeout);
  res.setTimeout(config.server.requestTimeout);
  next();
});

// Setup all routes
setupRoutes(app, middleware);

/**
 * Global error handler middleware
 * Handles all errors and returns consistent error responses
 *
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((err, req, res, next) => {
  // Log error for debugging (skip in test environment)
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error occurred:', {
      path: req.path,
      method: req.method,
      status: err.status || config.errorCodes.InternalServerError,
      code: err.code || 'InternalServerError',
      message: err.message || config.errors.unexpectedError,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Default error handler for all errors
  const status = err.status || config.errorCodes.InternalServerError;
  const code = err.code || 'InternalServerError';
  const message = err.message || config.errors.unexpectedError;

  res.status(status).json(
    createErrorResponse(status, code, message)
  );
});

// Start server only if this file is run directly (not when imported by tests)
if (require.main === module) {
  app.listen(config.server.port, () => {
    console.log(`Mock IONOS Billing API server running on port ${config.server.port}`);
    // Only log credentials in development environment for security
    if (process.env.NODE_ENV === 'development') {
      console.log(`Valid credentials: ${config.auth.username} / ${config.auth.password}`);
    }
  });
}

// Export app and utility functions for testing
module.exports = app;
module.exports.clearRateLimit = middleware.clearRateLimit;
