/**
 * Traffic Endpoint Tests
 * 
 * Tests for the Traffic endpoint:
 * - Response structure validation
 * - Invalid parameters handling
 * - Error responses
 */

const request = require('supertest');
const app = require('../../../mock-server/server');
const { createAuthHeader, validateSchema } = require('../../helpers/test-helpers');
const { credentials, contracts, periods, baseUrls } = require('../../fixtures/constants');

describe('Traffic Endpoint Tests', () => {
  const authHeader = createAuthHeader(credentials.valid.username, credentials.valid.password);

  describe('Response Structure', () => {
    test('should return valid traffic response structure', async () => {
      const response = await request(app)
        .get(`${baseUrls.traffic}/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Verify basic structure
      expect(response.body).toHaveProperty('metadata');
      expect(response.body).toHaveProperty('datacenters');
      expect(response.body.metadata).toHaveProperty('period');
      expect(Array.isArray(response.body.datacenters)).toBe(true);
    });
  });

  describe('Invalid Parameters', () => {
    test('should return 422 for wrong period format', async () => {
      const response = await request(app)
        .get(`/${contracts.valid}/traffic/${periods.wrongFormat}`)
        .set('Authorization', authHeader)
        .expect(422);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnprocessableEntityError');
      expect(response.body.message).toEqual('Period invalid');
    });
  });
});
