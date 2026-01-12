/**
 * Invoices Endpoint Tests
 * 
 * Tests for the Invoices endpoint:
 * - Response structure validation
 * - Schema compliance
 * - Data type validation
 * - Invalid parameters handling
 * - Error responses
 */

const request = require('supertest');
const app = require('../../../mock-server/server');
const { createAuthHeader, validateSchema } = require('../../helpers/test-helpers');
const { credentials, contracts, invoices, baseUrls } = require('../../fixtures/constants');

describe('Invoices Endpoint Tests', () => {
  const authHeader = createAuthHeader(credentials.valid.username, credentials.valid.password);

  describe('Response Structure', () => {
    test('should return valid invoice response structure for single invoice', async () => {
      const response = await request(app)
        .get(`${baseUrls.invoices}/${invoices.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Validate against schema
      const validation = validateSchema(response.body, 'invoice-schema');
      expect(validation.isValid).toBe(true);
      if (validation.errors.length > 0) {
        // Fail test with detailed error information
        expect(validation.errors).toEqual([]);
      }

      // Verify required fields
      expect(response.body).toHaveProperty('metadata');
      expect(response.body).toHaveProperty('datacenters');
      expect(response.body).toHaveProperty('total');

      // Verify metadata structure
      expect(response.body.metadata).toHaveProperty('invoiceId');
      expect(response.body.metadata).toHaveProperty('contractId');
      expect(response.body.metadata).toHaveProperty('customerId');
      expect(response.body.metadata).toHaveProperty('finallyPosted');
      expect(typeof response.body.metadata.finallyPosted).toBe('boolean');

      // Verify total structure
      expect(response.body.total).toHaveProperty('quantity');
      expect(response.body.total).toHaveProperty('unit');
      expect(typeof response.body.total.quantity).toBe('number');
    });

    test('should return valid invoice list response structure', async () => {
      const response = await request(app)
        .get(baseUrls.invoices)
        .set('Authorization', authHeader)
        .expect(200);

      // Invoice list is an array
      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        const validation = validateSchema(response.body[0], 'invoice-schema');
        expect(validation.isValid).toBe(true);
      }
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent contract', async () => {
      const response = await request(app)
        .get(`/${contracts.invalid}/invoices`)
        .set('Authorization', authHeader)
        .expect(404);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('NotFoundError');
      expect(response.body.message).toEqual('ContractId not found for user');
    });

    test('should return 404 for non-existent invoice ID', async () => {
      const response = await request(app)
        .get(`/${contracts.valid}/invoices/${invoices.invalid}`)
        .set('Authorization', authHeader)
        .expect(404);

      const validation = validateSchema(response.body, 'error-schema');
      expect(validation.isValid).toBe(true);
      expect(response.body.code).toBe('NotFoundError');
      expect(response.body.message).toEqual('Invoice with the ID not found');
    });
  });
});
