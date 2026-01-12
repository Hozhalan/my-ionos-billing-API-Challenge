/**
 * Configuration and Constants
 *
 * Centralized configuration for the mock server
 *
 * @module config
 */

module.exports = {
  // Server configuration
  server: {
    port: process.env.MOCK_SERVER_PORT || 3000,
    requestTimeout: 30000 // 30 seconds
  },

  // Authentication
  // NOTE: Hardcoded credentials are INTENTIONAL for this mock server.
  auth: {
    username: process.env.MOCK_USERNAME || 'testuser',
    password: process.env.MOCK_PASSWORD || 'testpass'
  },

  // Rate limiting
  rateLimit: {
    maxRequests: 2,
    windowMs: 1000 // 1 second
  },

  // Test data constants
  testData: {
    customerId: 112505406,
    defaultContractId: 441759,
    invalidContractId: '999999',
    vdcUUID: 'f2c2edf6-49f7-4687-8100-872b4d02ddcc',
    vdcName: 'Main VDC',
    resourceUUID: '504b4dff-56e3-49cd-89b1-dbed716c6265',
    datacenterId: '54eb1ed9-06f5-4bfb-a4f0-07cc373f5ee1',
    defaultPeriod: '2020-01',
    defaultDate: '2025-01-01',
    // Invoice defaults
    defaultInvoiceId: 'GY00012345',
    defaultInvoiceAmount: 2.94,
    defaultInvoiceCreatedDate: '2020-02-05T04:00:00',
    defaultInvoiceStartDate: '2020-01-01',
    defaultInvoiceEndDate: '2020-01-31',
    defaultInvoicePostingPeriod: '2020-01',
    defaultInvoiceReference: '123456|111',
    defaultInvoiceResellerRef: 'bricksonline',
    // Product defaults
    defaultUnitCost: 0.02,
    defaultProductMeterId: 'C01000',
    defaultProductMeterDesc: '1h core AMD',
    defaultProductUnit: '1hour',
    defaultProductLiability: 'Please double check your contract for prices.',
    // EVN defaults
    defaultItemStub: 'C01000',
    defaultValue: 2,
    defaultValueDivisor: 1,
    defaultAdditionalParameters: 'AMD_OPTERON',
    defaultIntervalMin: 44640,
    defaultIntervalDivisor: 60,
    // Traffic defaults
    defaultTrafficValue: 1000000,
    defaultTrafficItemStub: 'TRAFFIC',
    // Utilization defaults
    defaultUtilization: 85.5,
    // Datacenter defaults
    defaultLocation: 'EU',
    defaultProductGroup: 'PG 1',
    defaultMeterId: 'C010EU',
    defaultMeterDesc: '1h core AMD - EU',
    defaultQuantity: 12960,
    defaultQuantityUnit: '1hour',
    defaultCurrency: 'EUR'
  },

  // Error messages
  errors: {
    unauthorized: 'Credentials failed', // 401 Unauthorized Credentials failed
    forbidden: 'Restricted access', // 403 Forbidden
    notFound: 'ContractId not found for user', // 404 Not Found
    invoiceNotFound: 'Invoice with the ID not found', // 404 Not Found
    invoiceWrongContract: 'Invoice with the ID doesn\'t belong to the contract', // 404 Not Found
    periodInvalid: 'Period invalid', // 422 Unprocessable Entity
    dateInvalid: 'Date format invalid. Expected YYYY-MM-DD', // 422 Unprocessable Entity
    rateLimitExceeded: 'Rate limit exceeded. Maximum 2 requests per second.', // 429 Too Many Requests
    endpointNotFound: 'Endpoint not found', // 404 Not Found
    unexpectedError: 'Unexpected error', // 500 Internal Server Error
    invalidContractFormat: 'Invalid contract ID format' // 400 Bad Request
  },

  // Error codes
  errorCodes: {
    BadRequest: 400,
    UnauthorizedError: 401,
    ForbiddenError: 403,
    NotFoundError: 404,
    UnprocessableEntityError: 422,
    TooManyRequestsError: 429,
    InternalServerError: 500
  }
};
