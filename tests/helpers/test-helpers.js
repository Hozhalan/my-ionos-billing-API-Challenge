/**
 * Test Helper Utilities
 *
 * Provides common utilities for API testing including:
 * - Schema validation
 * - Authentication helpers
 * - Request builders
 *
 * @module utils/test-helpers
 */

const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv({ allErrors: true });

// Schema cache to avoid recompiling schemas on every validation
const schemaCache = new Map();

/**
 * Load and compile a JSON schema (with caching)
 *
 * @param {string} schemaName - Name of the schema file (without .json extension)
 * @returns {Function} Compiled validator function
 */
function loadSchema(schemaName) {
  // Return cached validator if available
  if (schemaCache.has(schemaName)) {
    return schemaCache.get(schemaName);
  }

  // Load, compile, and cache the schema
  const schemaPath = path.join(__dirname, '..', 'contract', 'schemas', `${schemaName}.json`);
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const validator = ajv.compile(schema);
  schemaCache.set(schemaName, validator);

  return validator;
}

/**
 * Validate response against a schema
 *
 * @param {Object} response - Response object to validate
 * @param {string} schemaName - Name of the schema file
 * @returns {Object} Validation result with isValid and errors
 */
function validateSchema(response, schemaName) {
  const validate = loadSchema(schemaName);
  const isValid = validate(response);

  return {
    isValid,
    errors: validate.errors || []
  };
}

/**
 * Create Basic Auth header
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {string} Authorization header value
 */
function createAuthHeader(username, password) {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${credentials}`;
}

/**
 * Sleep/delay function for rate limiting tests
 *
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>} Promise that resolves after the delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  loadSchema,
  validateSchema,
  createAuthHeader,
  sleep
};
