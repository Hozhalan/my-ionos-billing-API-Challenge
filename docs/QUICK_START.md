# Quick Start Guide

Get up and running with the IONOS Billing API test suite in minutes.

## Prerequisites

- **Node.js** v22.0.0 or higher
- **npm** v10.0.0 or higher

Verify installation:
```bash
node --version  # Should be >= 22.0.0
npm --version   # Should be >= 10.0.0
```

## Installation

```bash
npm install
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Coverage report
npm run test:coverage

# HTML test report
npm run test:report
```

**Note:** Tests automatically start the mock server - no manual setup required.

## Mock Server (Standalone)

Run the mock server for manual testing:

```bash
npm run mock-server
```

**Default Configuration:**
- Port: `3000` (set `MOCK_SERVER_PORT` to change)
- Username: `testuser`
- Password: `testpass`

**Example Request:**
```bash
curl -u testuser:testpass http://localhost:3000/12345/evn
```

## Test Structure

- 7 test suites covering different API endpoints
- 26 individual tests with schema validation
- Error handling for edge cases

## CI/CD

Automated testing via GitHub Actions (`.github/workflows/test.yml`):
- Runs on push, PR, and manual dispatch
- Node.js 22.x on Ubuntu
- Generates coverage reports

## Troubleshooting

**Port Already in Use**
```bash
MOCK_SERVER_PORT=3001 npm run mock-server
```

**Tests Fail on First Run**
- Ensure Node.js 22+ and npm 10+ are installed
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

**Coverage Report Not Generated**
- Run `npm run test:coverage` explicitly

## Next Steps

1. Run the test suite: `npm test`
2. Review coverage: `npm run test:coverage`
3. Explore test files in `tests/` directory
4. Customize mock server in `mock-server/` directory

---
