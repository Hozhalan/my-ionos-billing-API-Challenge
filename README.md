# IONOS Billing API Test Suite

> Comprehensive automated test suite for the **IONOS Public Billing API** with full endpoint coverage, JSON Schema validation, rate limiting tests, and CI/CD integration.

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Running Tests](#-running-tests)
- [Mock Server](#-mock-server)
- [CI/CD](#-cicd)
- [Dependencies](#-dependencies)
- [Documentation](#-documentation)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)

## 📋 Overview

This project provides a complete testing solution for the IONOS Public Billing API, featuring comprehensive endpoint coverage, automated schema validation, rate limiting tests, and seamless CI/CD integration.

## ✨ Features

- ✅ **Authentication Testing** - Basic Auth credential validation and security
- ✅ **Schema Validation** - JSON Schema validation for all API responses
- ✅ **Error Handling** - Comprehensive edge case and error scenario testing
- ✅ **Rate Limiting** - Utilization endpoint throttling tests (2 req/sec)
- ✅ **Mock Server** - Full-featured Express.js mock server for testing
- ✅ **CI/CD Integration** - Automated testing via GitHub Actions
- ✅ **Test Reports** - HTML test reports and coverage analysis

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Generate HTML test report
npm run test:report

# Start mock server (standalone)
npm run mock-server
```

For detailed setup instructions, see [QUICK_START.md](./docs/QUICK_START.md).

## 📦 Prerequisites

- **Node.js** v22.0.0 or higher
- **npm** v10.0.0 or higher

Verify your installation:
```bash
node --version  # Should be >= 22.0.0
npm --version   # Should be >= 10.0.0
```

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd my-ionos-billing-API-Challenge
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **(Optional) Configure environment variables:**
   ```bash
   # Windows (PowerShell)
   $env:MOCK_SERVER_PORT=3000
   $env:MOCK_USERNAME=testuser
   $env:MOCK_PASSWORD=testpass
   
   # Linux/macOS
   export MOCK_SERVER_PORT=3000
   export MOCK_USERNAME=testuser
   export MOCK_PASSWORD=testpass
   ```

## 📁 Project Structure

```
my-ionos-billing-API-Challenge/
├── .github/
│   └── workflows/
│       └── test.yml                    # CI/CD workflow configuration
├── .gitignore                          # Git ignore rules
├── config.js                           # Server configuration, constants, and defaults
├── jest.config.js                      # Jest test framework configuration
├── package.json                        # Project dependencies and scripts
├── package-lock.json                   # Locked dependency versions
├── README.md                           # This file
│
├── mock-server/                        # Mock API server implementation
│   ├── server.js                       # Express server setup and initialization
│   ├── middleware.js                   # Authentication, rate limiting, validation
│   ├── routes.js                       # API endpoint definitions and handlers
│   └── response-generators.js          # Dynamic response data generation
│
├── tests/                              # Test suite
│   ├── api/                            # API endpoint tests
│   │   ├── auth/                       # Authentication tests
│   │   │   └── auth.test.js
│   │   ├── evn/                        # EVN endpoint tests
│   │   │   └── evn.test.js
│   │   ├── invoices/                   # Invoice endpoint tests
│   │   │   └── invoices.test.js
│   │   ├── products/                   # Products endpoint tests
│   │   │   └── products.test.js
│   │   ├── traffic/                    # Traffic endpoint tests
│   │   │   └── traffic.test.js
│   │   ├── utilization/                # Utilization endpoint tests (rate limited)
│   │   │   └── utilization.test.js
│   │   └── common/                     # Common error handling tests
│   │       └── errors.test.js
│   ├── contract/                       # Contract-related resources
│   │   └── schemas/                    # JSON Schema definitions
│   │       ├── error-schema.json       # Error response schema
│   │       ├── evn-schema.json         # EVN endpoint response schema
│   │       ├── invoice-schema.json     # Invoice endpoint response schema
│   │       └── products-schema.json    # Products endpoint response schema
│   ├── fixtures/                       # Test fixtures and constants
│   │   └── constants.js                # Centralized test constants
│   └── helpers/                        # Test helper utilities
│       ├── test-helpers.js             # Schema validation, auth helpers
│       └── validators.js               # Request parameter validation logic
│
└── docs/                               # Additional documentation
    ├── QUICK_START.md                  # Quick setup guide
    ├── TEST_COVERAGE_DETAILS.md        # Detailed test coverage documentation
    └── FUTURE_ENHANCEMENTS.md          # Planned improvements
```

## 🏗️ Architecture

### Mock Server Components

The mock server is built with Express.js and follows a modular architecture:

- **Configuration** (`config.js`) - Server settings, port, credentials, rate limits, constants
- **Middleware** (`mock-server/middleware.js`) - Authentication, rate limiting, input sanitization, error handling
- **Validators** (`tests/helpers/validators.js`) - Request parameter validation, error response generation
- **Response Generators** (`mock-server/response-generators.js`) - Dynamic response data creation with realistic test data
- **Routes** (`mock-server/routes.js`) - API endpoint handlers and routing logic

### Testing Stack

- **Jest** - Test framework and runner with parallel execution
- **Supertest** - HTTP assertion library for API testing
- **AJV** - JSON Schema validator for response validation
- **Express** - Mock server web framework
- **express-basic-auth** - Basic authentication middleware

### Key Features

- **Schema Validation**: All API responses are validated against JSON Schema definitions
- **Rate Limiting**: In-memory rate limiting with automatic cleanup to prevent memory leaks
- **Input Sanitization**: Basic sanitization to prevent injection attacks
- **Error Handling**: Consistent error response format with proper HTTP status codes
- **Test Isolation**: Each test runs in isolation with proper setup/teardown

## 🎯 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Generate coverage report (text, HTML, LCOV, JSON)
npm run test:coverage

# Generate HTML test report
npm run test:report
```

### Test Organization

Tests are organized by functional area in `tests/api/`:

- **Authentication** - Credential validation, unauthorized access, error handling
- **EVN** - Response structure validation, schema compliance, error cases
- **Invoices** - Single invoice retrieval, list responses, schema validation
- **Products** - Product listing, response structure, schema compliance
- **Traffic** - Traffic data retrieval, response validation, error handling
- **Utilization** - Rate limiting (2 req/sec), response validation, reset behavior
- **Common Errors** - 404 handling, error response structure validation

For detailed test coverage information, see [TEST_COVERAGE_DETAILS.md](./docs/TEST_COVERAGE_DETAILS.md).

## 🖥️ Mock Server

The mock server runs automatically during tests via Supertest. To run it standalone for manual testing:

```bash
npm run mock-server
```

**Default Configuration:**
- Port: `3000` (configurable via `MOCK_SERVER_PORT` environment variable)
- Username: `testuser` (configurable via `MOCK_USERNAME` environment variable)
- Password: `testpass` (configurable via `MOCK_PASSWORD` environment variable)

**Example Request:**
```bash
# Using curl
curl -u testuser:testpass http://localhost:3000/12345/evn

# Using PowerShell (Windows)
$cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("testuser:testpass"))
Invoke-RestMethod -Uri "http://localhost:3000/12345/evn" -Headers @{Authorization="Basic $cred"}
```

> **⚠️ Security Note:** This is a **mock server for testing purposes only**. Default credentials are hardcoded intentionally for ease of testing. If deploying to production-like environments, always use environment variables (`MOCK_USERNAME` and `MOCK_PASSWORD`) and never commit real credentials to version control.

## 🔄 CI/CD

### GitHub Actions

Automated testing is configured via `.github/workflows/test.yml`:

- **Triggers:**
  - Push to `main`, `master`, or `develop` branches
  - Pull requests to `main`, `master`, or `develop` branches
  - Manual workflow dispatch

- **Environment:**
  - Node.js 22.x on Ubuntu latest
  - npm cache enabled for faster builds

- **Actions:**
  1. Checkout code
  2. Setup Node.js 22.x with npm cache
  3. Install dependencies (`npm ci`)
  4. Run test suite (`npm test`)
  5. Generate coverage report (`npm run test:coverage`)
  6. Upload test report artifact (7-day retention)
  7. Upload coverage report artifact (7-day retention)

View test results in the **Actions** tab on GitHub. Artifacts are available for download for 7 days.

## 📚 Dependencies

### Runtime Dependencies

- `express` ^4.21.2 - Web framework for mock server
- `express-basic-auth` ^1.2.1 - Basic authentication middleware

### Development Dependencies

- `jest` ^30.1.3 - Testing framework and runner
- `supertest` ^7.0.0 - HTTP assertions for API testing
- `ajv` ^8.12.0 - JSON Schema validator
- `jest-html-reporter` ^4.3.0 - HTML test report generation

## 📖 Documentation

- **[QUICK_START.md](./docs/QUICK_START.md)** - Quick setup and usage guide
- **[TEST_COVERAGE_DETAILS.md](./docs/TEST_COVERAGE_DETAILS.md)** - Detailed test coverage and test case documentation
- **[FUTURE_ENHANCEMENTS.md](./docs/FUTURE_ENHANCEMENTS.md)** - Planned improvements and enhancements

## 🛠️ Development

### Adding New Tests

1. Create test file in appropriate directory under `tests/api/`
2. Follow existing test patterns and structure
3. Use test helpers from `tests/helpers/test-helpers.js`
4. Validate responses against JSON schemas in `tests/contract/schemas/`
5. Run tests to ensure they pass

### Adding New Endpoints

1. Add route handler in `mock-server/routes.js`
2. Add response generator in `mock-server/response-generators.js`
3. Add validation logic in `tests/helpers/validators.js` if needed
4. Create JSON schema in `tests/contract/schemas/`
5. Write tests in appropriate test file under `tests/api/`
6. Update this README with endpoint information

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows (PowerShell)
$env:MOCK_SERVER_PORT=3001; npm run mock-server

# Linux/macOS
MOCK_SERVER_PORT=3001 npm run mock-server
```

### Tests Fail on First Run

1. Ensure Node.js 22+ and npm 10+ are installed
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again
4. Verify all dependencies installed correctly

### Coverage Report Not Generated

- Run `npm run test:coverage` explicitly
- Check that `coverage/` directory is not gitignored (it should be)
- Verify Jest configuration in `jest.config.js`

### Module Resolution Errors

If you encounter "Cannot find module" errors:
- Verify all import paths match the current project structure
- Check that files exist in the expected locations
- Clear Jest cache: `npm test -- --clearCache`

## 🤝 Contributing

This is a test suite project. For improvements and enhancements, see [FUTURE_ENHANCEMENTS.md](./docs/FUTURE_ENHANCEMENTS.md).

---