/**
 * Middleware Functions
 *
 * Express middleware for authentication and rate limiting
 *
 * @module mock-server/middleware
 */

const expressBasicAuth = require('express-basic-auth');
const config = require('../config');
const {
  createErrorResponse,
  isValidContractFormat,
  isInvalidContract,
  sanitizeInput
} = require('../tests/helpers/validators');

// Rate limiting storage (2 requests per second per IP)
const utilizationRateLimit = new Map();

// Periodic cleanup of stale rate limit entries
// This prevents memory leaks in long-running servers
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [ip, requests] of utilizationRateLimit.entries()) {
    const recentRequests = requests.filter(
      timestamp => now - timestamp < config.rateLimit.windowMs
    );
    if (recentRequests.length === 0) {
      utilizationRateLimit.delete(ip);
    } else {
      utilizationRateLimit.set(ip, recentRequests);
    }
  }
}, config.rateLimit.windowMs);

// Unref the interval so it doesn't keep the process alive
// This allows tests to exit cleanly
cleanupInterval.unref();

/**
 * Authentication middleware
 * Validates Basic Auth credentials against configured username and password
 * Uses express-basic-auth for simplified authentication handling
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {Error} Returns 401 Unauthorized if credentials are invalid
 * @example
 * app.get('/protected', authenticate, (req, res) => { ... });
 */
const authenticate = expressBasicAuth({
  users: { [config.auth.username]: config.auth.password },
  challenge: true, // Sends WWW-Authenticate header for browser prompts
  unauthorizedResponse: (req) => {
    return createErrorResponse(
      config.errorCodes.UnauthorizedError,
      'UnauthorizedError',
      config.errors.unauthorized
    );
  }
});

/**
 * Rate limiting middleware for utilization endpoint
 * Enforces 2 requests per second per IP address
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void|Object} Returns error response if rate limit exceeded, otherwise calls next()
 * @example
 * app.get('/utilization', authenticate, rateLimitUtilization, (req, res) => { ... });
 */
function rateLimitUtilization(req, res, next) {
  const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();

  if (!utilizationRateLimit.has(clientIp)) {
    utilizationRateLimit.set(clientIp, []);
  }

  const requests = utilizationRateLimit.get(clientIp);

  // Remove requests older than the time window
  const recentRequests = requests.filter(
    timestamp => now - timestamp < config.rateLimit.windowMs
  );

  if (recentRequests.length >= config.rateLimit.maxRequests) {
    return res.status(config.errorCodes.TooManyRequestsError).json(
      createErrorResponse(
        config.errorCodes.TooManyRequestsError,
        'TooManyRequestsError',
        config.errors.rateLimitExceeded
      )
    );
  }

  recentRequests.push(now);
  utilizationRateLimit.set(clientIp, recentRequests);

  next();
}

/**
 * Input sanitization middleware
 * Sanitizes request parameters to prevent injection attacks
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
function sanitizeInputs(req, res, next) {
  // Sanitize route parameters
  if (req.params) {
    Object.keys(req.params).forEach(key => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizeInput(req.params[key]);
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeInput(req.query[key]);
      }
    });
  }

  next();
}

/**
 * Contract ID validation middleware
 * Validates contract ID format and existence
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void|Object} Returns error response if validation fails, otherwise calls next()
 */
function validateContract(req, res, next) {
  const contract = req.params.contract;

  // Validate contract ID format
  if (!isValidContractFormat(contract)) {
    return res.status(config.errorCodes.BadRequest).json(
      createErrorResponse(
        config.errorCodes.BadRequest,
        'BadRequest',
        config.errors.invalidContractFormat
      )
    );
  }

  // Check if contract is invalid (for testing 404 scenarios)
  if (isInvalidContract(contract)) {
    return res.status(config.errorCodes.NotFoundError).json(
      createErrorResponse(
        config.errorCodes.NotFoundError,
        'NotFoundError',
        config.errors.notFound
      )
    );
  }

  next();
}

/**
 * Clear rate limit map (useful for testing)
 * Removes all entries from the rate limit storage
 *
 * @returns {void}
 * @example
 * clearRateLimit(); // Clears all rate limit entries
 */
function clearRateLimit() {
  utilizationRateLimit.clear();
}

module.exports = {
  authenticate,
  rateLimitUtilization,
  sanitizeInputs,
  validateContract,
  clearRateLimit
};
