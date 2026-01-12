/**
 * Products Endpoint Tests
 * 
 * Tests for the Products endpoint:
 * - Response structure validation
 * - Schema compliance
 */

const request = require('supertest');
const app = require('../../../mock-server/server');
const { createAuthHeader, validateSchema } = require('../../helpers/test-helpers');
const { credentials, dates, baseUrls } = require('../../fixtures/constants');

describe('Products Endpoint Tests', () => {
  const authHeader = createAuthHeader(credentials.valid.username, credentials.valid.password);

  describe('Response Structure', () => {
    test('should return valid products response structure', async () => {
      const response = await request(app)
        .get(`${baseUrls.products}?date=${dates.valid}`)
        .set('Authorization', authHeader)
        .expect(200);

      // Validate against schema
      const validation = validateSchema(response.body, 'products-schema');
      expect(validation.isValid).toBe(true);
      if (validation.errors.length > 0) {
        // Fail test with detailed error information
        expect(validation.errors).toEqual([]);
      }

      // Verify required fields
      expect(response.body).toHaveProperty('metadata');
      expect(response.body).toHaveProperty('liability');
      expect(response.body).toHaveProperty('products');

      // Verify metadata
      expect(response.body.metadata).toHaveProperty('contractId');
      expect(response.body.metadata).toHaveProperty('customerId');
      expect(response.body.metadata).toHaveProperty('reference');

      // Verify products array
      expect(Array.isArray(response.body.products)).toBe(true);
      if (response.body.products.length > 0) {
        const product = response.body.products[0];
        expect(product).toHaveProperty('meterId');
        expect(product).toHaveProperty('meterDesc');
        expect(product).toHaveProperty('unit');
        expect(product).toHaveProperty('unitCost');
        expect(product.unitCost).toHaveProperty('quantity');
        expect(product.unitCost).toHaveProperty('unit');
      }
    });
  });
});
