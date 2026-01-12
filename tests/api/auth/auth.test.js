/**
 * Authentication Tests
 * 
 * Tests for authentication mechanisms:
 * - Valid credentials
 * - Invalid credentials
 * - Missing credentials
 * - Authentication error responses
 * - Health check endpoint (no auth required)
 */

const request = require('supertest');
const app = require('../../../mock-server/server');
const { createAuthHeader, validateSchema } = require('../../helpers/test-helpers');
const { credentials, contracts, periods, baseUrls } = require('../../fixtures/constants');

describe('Authentication Tests', () => {
  const baseUrl = `${baseUrls.evn}/${periods.valid}`;

  describe('Valid Authentication', () => {
    test('should accept valid Basic Auth credentials', async () => {
      const response = await request(app)
        .get(baseUrl)
        .set('Authorization', createAuthHeader(credentials.valid.username, credentials.valid.password))
        .expect(200);

      const validation = validateSchema(response.body, 'evn-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body).toHaveProperty('metadata');
      expect(response.body).toHaveProperty('datacenters');
    });
  });

  describe('Invalid Authentication', () => {
    test('should return 401 for invalid username', async () => {
      const response = await request(app)
        .get(baseUrl)
        .set('Authorization', createAuthHeader(credentials.invalid.username, credentials.valid.password))
        .expect(401);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnauthorizedError');
    });

    test('should return 401 for invalid password', async () => {
      const response = await request(app)
        .get(baseUrl)
        .set('Authorization', createAuthHeader(credentials.valid.username, credentials.invalid.password))
        .expect(401);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnauthorizedError');
    });

    test('should return 401 for completely wrong credentials', async () => {
      const response = await request(app)
        .get(baseUrl)
        .set('Authorization', createAuthHeader(credentials.invalid.username, credentials.invalid.password))
        .expect(401);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnauthorizedError');
    });

    test('should return 401 for missing Authorization header', async () => {
      const response = await request(app)
        .get(baseUrl)
        .expect(401);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnauthorizedError');
    });

    test('should return 401 for malformed Authorization header', async () => {
      const response = await request(app)
        .get(baseUrl)
        .set('Authorization', 'InvalidFormat')
        .expect(401);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnauthorizedError');
    });
  });

  describe('Authentication Error Response Structure', () => {
    test('should return properly structured error response for 401', async () => {
      const response = await request(app)
        .get(baseUrl)
        .set('Authorization', createAuthHeader('wrong', 'credentials'))
        .expect(401);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnauthorizedError');
    });
  });

  describe('Health Check Endpoint (No Auth Required)', () => {
    test('should allow access to ping endpoint without authentication', async () => {
      const response = await request(app)
        .get('/intern/ping')
        .expect(200);

      expect(response.text).toBe('1');
    });
  });
});
