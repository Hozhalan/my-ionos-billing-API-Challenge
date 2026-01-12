/**
 * Jest Configuration
 *
 * Configuration for the Jest test runner used in the IONOS Billing API test suite.
 *
 * Features:
 * - Node.js test environment
 * - Coverage collection from mock-server and tests
 * - HTML test reports
 * - Extended timeout for API tests
 *
 * @module jest.config
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Output configuration
  verbose: true,
  
  // Test file patterns
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/', '/coverage/'],
  
  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  collectCoverageFrom: [
    'mock-server/**/*.js',
    'tests/helpers/validators.js',
    'tests/**/*.js',
    '!tests/fixtures/**',
    '!tests/helpers/test-helpers.js',
    '!**/*.test.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  
  testTimeout: 10000,
  maxWorkers: '50%',
  
  // Reporters
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'IONOS Billing API Test Report',
        outputPath: './reports/test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        dateFormat: 'yyyy-mm-dd HH:MM:ss'
      }
    ]
  ]
};
