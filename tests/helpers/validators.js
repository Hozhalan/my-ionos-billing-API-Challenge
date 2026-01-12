/**
 * Validation Utilities
 *
 * Centralized validation functions for request parameters
 *
 * @module utils/validators
 */

const config = require('../../config');

/**
 * Get the last day of a month for a given period (YYYY-MM)
 *
 * @param {string} period - Period string in YYYY-MM format
 * @returns {number} Last day of the month (28-31)
 */
function getLastDayOfMonth(period) {
  const [year, month] = period.split('-');
  // Create date for first day of next month, then subtract 1 day
  const date = new Date(parseInt(year, 10), parseInt(month, 10), 0);
  return date.getDate();
}

/**
 * Validate period format (YYYY-MM) and ensure it's a valid month
 *
 * @param {string} period - Period string to validate
 * @returns {boolean} True if valid
 */
function isValidPeriod(period) {
  if (!period || period === '' || !/^\d{4}-\d{2}$/.test(period)) {
    return false;
  }
  const [, month] = period.split('-');
  const monthNum = parseInt(month, 10);
  return monthNum >= 1 && monthNum <= 12;
}

/**
 * Validate date format (YYYY-MM-DD) and ensure it's a valid date
 *
 * @param {string} date - Date string to validate
 * @returns {boolean} True if valid
 */
function isValidDate(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  // Create date object and verify it's valid
  const d = new Date(date + 'T00:00:00.000Z');
  return (
    d instanceof Date &&
    !isNaN(d) &&
    d.toISOString().startsWith(date)
  );
}

/**
 * Validate contract ID format
 *
 * @param {string} contractId - Contract ID to validate
 * @returns {boolean} True if contract ID format is valid
 */
function isValidContractFormat(contractId) {
  return contractId && /^\d+$/.test(contractId);
}

/**
 * Check if contract ID is invalid (for testing 404 scenarios)
 *
 * @param {string} contractId - Contract ID to check
 * @returns {boolean} True if contract is invalid
 */
function isInvalidContract(contractId) {
  return contractId === config.testData.invalidContractId ||
    contractId.startsWith(config.testData.invalidContractId);
}

/**
 * Get current period in YYYY-MM format
 *
 * @returns {string} Current period
 */
function getCurrentPeriod() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Sanitize input string to prevent injection attacks
 * Removes null bytes and path traversal attempts, trims whitespace
 *
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  // Remove null bytes and path traversal attempts
  return input
    .replace(/\0/g, '')           // Remove null bytes
    .replace(/\.\./g, '')          // Remove path traversal attempts
    .replace(/[<>]/g, '')          // Remove HTML tag brackets
    .trim();
}

/**
 * Create error response object
 *
 * @param {number} status - HTTP status code
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @returns {Object} Error response object
 */
function createErrorResponse(status, code, message) {
  return {
    status,
    code,
    message
  };
}

module.exports = {
  isValidPeriod,
  isValidDate,
  isValidContractFormat,
  isInvalidContract,
  getCurrentPeriod,
  getLastDayOfMonth,
  sanitizeInput,
  createErrorResponse
};
