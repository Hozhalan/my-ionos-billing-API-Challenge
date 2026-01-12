# Test Coverage Details

> Comprehensive documentation of test coverage, test cases, and validation strategies for the IONOS Billing API test suite.

## Overview

This test suite provides comprehensive coverage of the IONOS Billing API endpoints, including authentication, response validation, error handling, and rate limiting scenarios. All tests use JSON Schema validation to ensure API responses conform to expected structures.

## Test Statistics

- **Test Suites:** 7
- **Total Tests:** 26+
- **Coverage:** Comprehensive endpoint and error case coverage
- **Status:** ✅ All tests passing
- **Schema Validation:** 100% of API responses validated

## Endpoint Coverage

| Endpoint | Method | Description | Rate Limit | Status |
|----------|--------|-------------|------------|--------|
| `/intern/ping` | GET | Health check endpoint (no auth required) | None | ✅ |
| `/:contractId/evn/:period` | GET | EVN data by period (YYYY-MM format) | None | ✅ |
| `/:contractId/evn` | GET | EVN data for current month | None | ✅ |
| `/:contractId/invoices/:invoiceId` | GET | Single invoice by ID | None | ✅ |
| `/:contractId/invoices` | GET | List invoices with pagination | None | ✅ |
| `/:contractId/products` | GET | List products (requires date query param) | None | ✅ |
| `/:contractId/traffic/:period` | GET | Traffic data by period (YYYY-MM format) | None | ✅ |
| `/:contractId/traffic` | GET | Traffic data for current month | None | ✅ |
| `/:contractId/utilization/:period` | GET | Utilization by period (YYYY-MM format) | 2 req/sec | ✅ |
| `/:contractId/utilization` | GET | Utilization for current month | 2 req/sec | ✅ |

## Test Suites

### 1. Authentication Tests (`tests/api/auth/auth.test.js`)

Tests authentication mechanisms and security:

#### Valid Authentication
- ✅ Accepts valid Basic Auth credentials
- ✅ Returns 200 status with valid credentials
- ✅ Validates response schema for authenticated requests

#### Invalid Authentication
- ✅ Returns 401 for invalid username
- ✅ Returns 401 for invalid password
- ✅ Returns 401 for completely wrong credentials
- ✅ Returns 401 for missing Authorization header
- ✅ Returns 401 for malformed Authorization header

#### Authentication Error Response Structure
- ✅ Returns properly structured error response for 401
- ✅ Error response includes status, code, and message fields
- ✅ Error response validates against error-schema.json

#### Health Check Endpoint (No Auth Required)
- ✅ Allows access to `/intern/ping` without authentication
- ✅ Returns 200 status without credentials

**Test Count:** 8+ tests

---

### 2. EVN Endpoint Tests (`tests/api/evn/evn.test.js`)

Tests the EVN (Electricity Virtual Network) endpoint:

#### Response Structure
- ✅ Returns valid EVN response structure for period endpoint
- ✅ Returns valid EVN response structure for current month endpoint
- ✅ Response includes required metadata fields
- ✅ Response includes datacenters array with proper structure

#### Schema Validation
- ✅ Response validates against evn-schema.json
- ✅ All required fields are present
- ✅ Data types match schema definitions
- ✅ Nested objects validate correctly

#### Invalid Parameters
- ✅ Returns 422 for invalid period format
- ✅ Handles special characters in parameters
- ✅ Returns properly structured 422 error response

#### Error Handling
- ✅ Returns 404 for non-existent contract
- ✅ Returns properly structured 404 error response
- ✅ Error responses validate against error-schema.json

**Test Count:** 6+ tests

---

### 3. Invoices Endpoint Tests (`tests/api/invoices/invoices.test.js`)

Tests invoice retrieval endpoints:

#### Response Structure
- ✅ Returns valid invoice response structure for single invoice
- ✅ Returns valid invoice list response structure
- ✅ Single invoice includes all required fields
- ✅ Invoice list includes pagination metadata

#### Schema Validation
- ✅ Single invoice response validates against invoice-schema.json
- ✅ Invoice list response validates against invoice-schema.json
- ✅ All required fields are present and correctly typed

#### Error Handling
- ✅ Returns 404 for non-existent contract
- ✅ Returns 404 for non-existent invoice ID
- ✅ Error responses validate against error-schema.json

**Test Count:** 4+ tests

---

### 4. Products Endpoint Tests (`tests/api/products/products.test.js`)

Tests product listing endpoint:

#### Response Structure
- ✅ Returns valid products response structure
- ✅ Response includes products array
- ✅ Each product has required fields

#### Schema Validation
- ✅ Response validates against products-schema.json
- ✅ All required fields are present
- ✅ Data types match schema definitions

**Test Count:** 1+ test

---

### 5. Traffic Endpoint Tests (`tests/api/traffic/traffic.test.js`)

Tests traffic data endpoints:

#### Response Structure
- ✅ Returns valid traffic response structure
- ✅ Response includes traffic data with proper structure

#### Invalid Parameters
- ✅ Returns 422 for wrong period format
- ✅ Error response validates against error-schema.json

**Test Count:** 2+ tests

---

### 6. Utilization Endpoint Tests (`tests/api/utilization/utilization.test.js`)

Tests utilization endpoints with rate limiting:

#### Response Structure
- ✅ Returns valid utilization response structure
- ✅ Response includes utilization data with proper structure

#### Rate Limiting
- ✅ Allows 2 requests per second
- ✅ Returns 429 when exceeding rate limit (2 requests per second)
- ✅ Rate limit resets after 1 second
- ✅ 429 error response validates against error-schema.json

**Test Count:** 4+ tests

---

### 7. Common Error Handling Tests (`tests/api/common/errors.test.js`)

Tests general error handling scenarios:

#### Endpoint Not Found
- ✅ Returns 404 for non-existent endpoint
- ✅ Error response validates against error-schema.json
- ✅ Error response includes proper status, code, and message

**Test Count:** 1+ test

---