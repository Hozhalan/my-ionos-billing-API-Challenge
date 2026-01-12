/**
 * Utilization Endpoint Tests
 * 
 * Tests for the Utilization endpoint:
 * - Response structure validation
 * - Rate limiting (2 requests per second)
 * - Rate limit reset behavior
 * - Error responses
 */

const request = require('supertest');
const app = require('../../../mock-server/server');
const { clearRateLimit } = require('../../../mock-server/server');
const { createAuthHeader, validateSchema, sleep } = require('../../helpers/test-helpers');
const { credentials, contracts, periods, baseUrls } = require('../../fixtures/constants');

describe('Utilization Endpoint Tests', () => {
  const authHeader = createAuthHeader(credentials.valid.username, credentials.valid.password);

  // Clear rate limit before each test to ensure test isolation
  beforeEach(() => {
    clearRateLimit();
  });

  describe('Response Structure', () => {
    test('should return valid utilization response structure', async () => {
      const response = await request(app)
        .get(`${baseUrls.utilization}/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Verify basic structure
      expect(response.body).toHaveProperty('metadata');
      expect(response.body).toHaveProperty('datacenters');
      expect(response.body.metadata).toHaveProperty('period');
      expect(Array.isArray(response.body.datacenters)).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    test('should allow 2 requests per second', async () => {
      // First request should succeed
      const response1 = await request(app)
        .get(`/${contracts.valid}/utilization/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Second request should succeed
      const response2 = await request(app)
        .get(`/${contracts.valid}/utilization/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      expect(response2.body).toHaveProperty('metadata');
    });

    test('should return 429 when exceeding rate limit (2 requests per second)', async () => {
      // Make 2 requests quickly
      await request(app)
        .get(`/${contracts.valid}/utilization/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      await request(app)
        .get(`/${contracts.valid}/utilization/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Third request should be rate limited
      const response = await request(app)
        .get(`/${contracts.valid}/utilization/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(429);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('TooManyRequestsError');
      expect(response.body.message).toEqual('Rate limit exceeded. Maximum 2 requests per second.');
    });

    test('should reset rate limit after 1 second', async () => {
      // Make 2 requests
      await request(app)
        .get(`/${contracts.valid}/utilization/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      await request(app)
        .get(`/${contracts.valid}/utilization/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Wait for rate limit to reset (1 second + small buffer)
      await sleep(1100);

      // Should be able to make requests again
      const response = await request(app)
        .get(`/${contracts.valid}/utilization/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      expect(response.body).toHaveProperty('metadata');
    });
  });
});
