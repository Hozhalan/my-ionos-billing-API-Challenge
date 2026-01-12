/**
 * API Routes
 *
 * Route handlers for all API endpoints
 *
 * @module mock-server/routes
 */

const config = require('../config');
const {
  isValidPeriod,
  isValidDate,
  getCurrentPeriod,
  createErrorResponse
} = require('../tests/helpers/validators');
const {
  generateEVNResponse,
  generateInvoiceResponse,
  generateProductsResponse,
  generateTrafficResponse,
  generateUtilizationResponse
} = require('./response-generators');

/**
 * Setup all routes on the Express app
 *
 * @param {Object} app - Express application instance
 * @param {Object} middleware - Middleware functions
 * @returns {void}
 */
function setupRoutes(app, middleware) {
  const { authenticate, rateLimitUtilization, sanitizeInputs, validateContract } = middleware;

  // Apply input sanitization to all routes
  app.use(sanitizeInputs);

  // Health check endpoint (no auth required)
  app.get('/intern/ping', (req, res) => {
    res.status(200).send('1');
  });

  // EVN endpoints
  app.get('/:contract/evn/:period', authenticate, validateContract, (req, res) => {
    const { contract, period } = req.params;

    if (!isValidPeriod(period)) {
      return res.status(config.errorCodes.UnprocessableEntityError).json(
        createErrorResponse(
          config.errorCodes.UnprocessableEntityError,
          'UnprocessableEntityError',
          config.errors.periodInvalid
        )
      );
    }

    res.json(generateEVNResponse({ contractId: contract, period }));
  });

  app.get('/:contract/evn', authenticate, validateContract, (req, res) => {
    const { contract } = req.params;
    const period = getCurrentPeriod();

    res.json(generateEVNResponse({
      contractId: contract,
      period,
      includeCSV: false
    }));
  });

  // Invoice endpoints
  app.get('/:contract/invoices/:id', authenticate, validateContract, (req, res) => {
    const { contract, id } = req.params;

    if (id === 'INVALID_ID') {
      return res.status(config.errorCodes.NotFoundError).json(
        createErrorResponse(
          config.errorCodes.NotFoundError,
          'NotFoundError',
          config.errors.invoiceNotFound
        )
      );
    }

    if (id === 'WRONG_CONTRACT') {
      return res.status(config.errorCodes.NotFoundError).json(
        createErrorResponse(
          config.errorCodes.NotFoundError,
          'NotFoundError',
          config.errors.invoiceWrongContract
        )
      );
    }

    res.json(generateInvoiceResponse({ invoiceId: id, contractId: contract }));
  });

  app.get('/:contract/invoices', authenticate, validateContract, (req, res) => {
    const { contract } = req.params;

    res.json([generateInvoiceResponse({
      contractId: contract,
      includeDatacenters: false
    })]);
  });

  // Products endpoint
  app.get('/:contract/products', authenticate, validateContract, (req, res) => {
    const { contract } = req.params;
    const { date } = req.query;

    // Validate that date parameter is provided and valid
    if (!date || !isValidDate(date)) {
      return res.status(config.errorCodes.UnprocessableEntityError).json(
        createErrorResponse(
          config.errorCodes.UnprocessableEntityError,
          'UnprocessableEntityError',
          config.errors.dateInvalid
        )
      );
    }

    res.json(generateProductsResponse({ contractId: contract }));
  });

  // Traffic endpoints
  app.get('/:contract/traffic/:period', authenticate, validateContract, (req, res) => {
    const { contract, period } = req.params;

    if (!isValidPeriod(period)) {
      return res.status(config.errorCodes.UnprocessableEntityError).json(
        createErrorResponse(
          config.errorCodes.UnprocessableEntityError,
          'UnprocessableEntityError',
          config.errors.periodInvalid
        )
      );
    }

    res.json(generateTrafficResponse({ contractId: contract, period }));
  });

  app.get('/:contract/traffic', authenticate, validateContract, (req, res) => {
    const { contract } = req.params;
    const period = getCurrentPeriod();

    res.json(generateTrafficResponse({
      contractId: contract,
      period,
      includeData: false
    }));
  });

  // Utilization endpoints (with rate limiting)
  app.get('/:contract/utilization/:period', authenticate, rateLimitUtilization, validateContract, (req, res) => {
    const { contract, period } = req.params;

    if (!isValidPeriod(period)) {
      return res.status(config.errorCodes.UnprocessableEntityError).json(
        createErrorResponse(
          config.errorCodes.UnprocessableEntityError,
          'UnprocessableEntityError',
          config.errors.periodInvalid
        )
      );
    }

    res.json(generateUtilizationResponse({ contractId: contract, period }));
  });

  app.get('/:contract/utilization', authenticate, rateLimitUtilization, validateContract, (req, res) => {
    const { contract } = req.params;
    const period = getCurrentPeriod();

    res.json(generateUtilizationResponse({
      contractId: contract,
      period,
      includeData: false
    }));
  });

  // 404 handler for unknown routes
  app.use((req, res) => {
    res.status(config.errorCodes.NotFoundError).json(
      createErrorResponse(
        config.errorCodes.NotFoundError,
        'NotFoundError',
        config.errors.endpointNotFound
      )
    );
  });
}

module.exports = { setupRoutes };
