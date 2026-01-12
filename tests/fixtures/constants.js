/**
 * Test Constants
 *
 * Centralized constants for test files
 *
 * @module tests/fixtures/constants
 */

const config = require('../../config');

module.exports = {
  // Test credentials
  credentials: {
    valid: {
      username: config.auth.username,
      password: config.auth.password
    },
    invalid: {
      username: 'wronguser',
      password: 'wrongpass'
    }
  },

  // Test contract IDs
  contracts: {
    valid: String(config.testData.defaultContractId),
    invalid: config.testData.invalidContractId,
    large: '999999999'
  },

  // Test periods
  periods: {
    valid: config.testData.defaultPeriod,
    invalid: 'invalid-period',
    min: '2000-01',
    max: '2099-12',
    wrongFormat: '2020-1'
  },

  // Test dates
  dates: {
    valid: config.testData.defaultDate,
    invalid: 'invalid-date'
  },

  // Test invoice IDs
  invoices: {
    valid: 'INV123',
    invalid: 'INVALID_ID',
    wrongContract: 'WRONG_CONTRACT'
  },

  // Test resource types
  resourceTypes: {
    server: 'SERVER',
    nic: 'NIC'
  },

  // Base URLs
  baseUrls: {
    evn: `/${config.testData.defaultContractId}/evn`,
    invoices: `/${config.testData.defaultContractId}/invoices`,
    products: `/${config.testData.defaultContractId}/products`,
    traffic: `/${config.testData.defaultContractId}/traffic`,
    utilization: `/${config.testData.defaultContractId}/utilization`
  }
};
