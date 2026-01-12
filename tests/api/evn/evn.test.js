/**
 * EVN Endpoint Tests
 * 
 * Tests for the EVN (Electricity Virtual Network) endpoint:
 * - Response structure validation
 * - Schema compliance
 * - Data type validation
 * - Invalid parameters handling
 * - Error responses
 */

const request = require('supertest');
const app = require('../../../mock-server/server');
const { createAuthHeader, validateSchema } = require('../../helpers/test-helpers');
const { credentials, contracts, periods, baseUrls } = require('../../fixtures/constants');

describe('EVN Endpoint Tests', () => {
  const authHeader = createAuthHeader(credentials.valid.username, credentials.valid.password);

  describe('Response Structure', () => {
    test('should return valid EVN response structure for period endpoint', async () => {
      const response = await request(app)
        .get(`${baseUrls.evn}/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Validate against schema
      const validation = validateSchema(response.body, 'evn-schema');
      expect(validation.isValid).toBe(true);
      if (validation.errors.length > 0) {
        // Fail test with detailed error information
        expect(validation.errors).toEqual([]);
      }

      // Verify required fields
      expect(response.body).toHaveProperty('metadata');
      expect(response.body).toHaveProperty('datacenters');
      expect(response.body).toHaveProperty('evnCSV');

      // Verify metadata structure
      expect(response.body.metadata).toHaveProperty('customerId');
      expect(response.body.metadata).toHaveProperty('contractId');
      expect(response.body.metadata).toHaveProperty('period');
      expect(typeof response.body.metadata.customerId).toBe('number');
      expect(typeof response.body.metadata.contractId).toBe('number');
      expect(response.body.metadata.period).toMatch(/^\d{4}-\d{2}$/);

      // Verify datacenters array structure
      expect(Array.isArray(response.body.datacenters)).toBe(true);
      if (response.body.datacenters.length > 0) {
        const datacenter = response.body.datacenters[0];
        expect(datacenter).toHaveProperty('vdcUUID');
        expect(datacenter).toHaveProperty('name');
        expect(datacenter).toHaveProperty('data');
        expect(Array.isArray(datacenter.data)).toBe(true);
      }

      // Verify evnCSV is an array
      expect(Array.isArray(response.body.evnCSV)).toBe(true);
    });

    test('should return valid EVN response structure for current month endpoint', async () => {
      const response = await request(app)
        .get(baseUrls.evn)
        .set('Authorization', authHeader)
        .expect(200);

      // Validate against schema
      const validation = validateSchema(response.body, 'evn-schema');
      expect(validation.isValid).toBe(true);

      expect(response.body).toHaveProperty('metadata');
      expect(response.body).toHaveProperty('datacenters');
      expect(response.body).toHaveProperty('evnCSV');
    });
  });

  describe('Invalid Parameters', () => {
    test('should return 422 for invalid period format', async () => {
      const response = await request(app)
        .get(`/${contracts.valid}/evn/${periods.invalid}`)
        .set('Authorization', authHeader)
        .expect(422);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnprocessableEntityError');
      expect(response.body.message).toEqual('Period invalid');
    });

    test('should handle special characters in parameters', async () => {
      const response = await request(app)
        .get(`/${contracts.valid}/evn/${periods.valid}%20`)
        .set('Authorization', authHeader)
        .expect(422);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnprocessableEntityError');
      expect(response.body.message).toEqual('Period invalid');
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent contract', async () => {
      const response = await request(app)
        .get(`/${contracts.invalid}/evn/${periods.valid}`)
        .set('Authorization', authHeader)
        .expect(404);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('NotFoundError');
      expect(response.body.message).toEqual('ContractId not found for user');
    });

    test('should return properly structured 422 error', async () => {
      const response = await request(app)
        .get(`/${contracts.valid}/evn/${periods.invalid}`)
        .set('Authorization', authHeader)
        .expect(422);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('UnprocessableEntityError');
      expect(response.body.message).toEqual('Period invalid');
    });
  });
});
