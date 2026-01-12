/**
 * Common Error Handling Tests
 * 
 * Tests for general error handling:
 * - Endpoint not found
 * - Error response structure validation
 */

const request = require('supertest');
const app = require('../../../mock-server/server');
const { createAuthHeader, validateSchema } = require('../../helpers/test-helpers');
const { credentials, contracts } = require('../../fixtures/constants');

describe('Common Error Handling Tests', () => {
  const authHeader = createAuthHeader(credentials.valid.username, credentials.valid.password);

  describe('Endpoint Not Found', () => {
    test('should return 404 for non-existent endpoint', async () => {
      const response = await request(app)
        .get(`/${contracts.valid}/nonexistent`)
        .set('Authorization', authHeader)
        .expect(404);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('NotFoundError');
      expect(response.body.message).toEqual('Endpoint not found');
    });
  });
});
