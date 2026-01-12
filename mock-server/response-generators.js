/**
 * Response Generators
 *
 * Functions to generate consistent API responses
 *
 * @module mock-server/response-generators
 */

const config = require('../config');
const { getLastDayOfMonth } = require('../tests/helpers/validators');

/**
 * Generate EVN response data
 *
 * @param {Object} [params={}] - Parameters for response generation
 * @param {string|number} [params.contractId] - Contract ID (defaults to config value)
 * @param {string} [params.period] - Period in YYYY-MM format (defaults to config value)
 * @param {boolean} [params.includeData=true] - Whether to include datacenter data
 * @param {boolean} [params.includeCSV=true] - Whether to include CSV data
 * @returns {Object} EVN response object with metadata, datacenters, and evnCSV
 * @example
 * generateEVNResponse({ contractId: 441759, period: '2020-01' })
 */
function generateEVNResponse(params = {}) {
  const {
    contractId = config.testData.defaultContractId,
    period = config.testData.defaultPeriod,
    includeData = true,
    includeCSV = true
  } = params;

  const response = {
    metadata: {
      customerId: config.testData.customerId,
      contractId: typeof contractId === 'string' ? parseInt(contractId) : contractId,
      period: period
    },
    datacenters: []
  };

  if (includeData) {
    const lastDay = String(getLastDayOfMonth(period)).padStart(2, '0');
    response.datacenters.push({
      vdcUUID: config.testData.vdcUUID,
      name: config.testData.vdcName,
      data: [
        {
          resourceType: 'SERVER',
          resourceUUID: config.testData.resourceUUID,
          intervalMin: config.testData.defaultIntervalMin,
          intervalDivisor: config.testData.defaultIntervalDivisor,
          from: `${period}-01T00:00:00.000Z`,
          to: `${period}-${lastDay}T23:59:59.999Z`,
          itemStub: config.testData.defaultItemStub,
          value: config.testData.defaultValue,
          valueDivisor: config.testData.defaultValueDivisor,
          additionalParameters: config.testData.defaultAdditionalParameters
        }
      ]
    });
  }

  if (includeCSV) {
    const lastDay = String(getLastDayOfMonth(period)).padStart(2, '0');
    response.evnCSV = [
      'contractId,VDCUUID,VDCName,ResourceType,ResourceUUID,IntervalMin,IntervalDivisor,From,To,ItemStub,Value,ValueDivisor,Additional Parameters',
      `${contractId},${config.testData.vdcUUID},${config.testData.vdcName},SERVER,${config.testData.resourceUUID},${config.testData.defaultIntervalMin},${config.testData.defaultIntervalDivisor},${period}-01T00:00:00.000Z,${period}-${lastDay}T23:59:59.999Z,${config.testData.defaultItemStub},${config.testData.defaultValue},${config.testData.defaultValueDivisor},${config.testData.defaultAdditionalParameters}`
    ];
  } else {
    response.evnCSV = [];
  }

  return response;
}

/**
 * Generate invoice response data
 *
 * @param {Object} [params={}] - Parameters for response generation
 * @param {string} [params.invoiceId] - Invoice ID (defaults to config value)
 * @param {string|number} [params.contractId] - Contract ID (defaults to config value)
 * @param {number} [params.amount] - Invoice amount (defaults to config value)
 * @param {boolean} [params.includeDatacenters=true] - Whether to include datacenter data
 * @returns {Object} Invoice response object with metadata, datacenters, and total
 * @example
 * generateInvoiceResponse({ invoiceId: 'INV123', contractId: 441759, amount: 100.50 })
 */
function generateInvoiceResponse(params = {}) {
  const {
    invoiceId = config.testData.defaultInvoiceId,
    contractId = config.testData.defaultContractId,
    amount = config.testData.defaultInvoiceAmount,
    includeDatacenters = true
  } = params;

  const response = {
    metadata: {
      invoiceId,
      contractId: typeof contractId === 'string' ? parseInt(contractId) : contractId,
      customerId: config.testData.customerId,
      createdDate: config.testData.defaultInvoiceCreatedDate,
      startDate: config.testData.defaultInvoiceStartDate,
      endDate: config.testData.defaultInvoiceEndDate,
      postingPeriod: config.testData.defaultInvoicePostingPeriod,
      finallyPosted: true,
      reference: config.testData.defaultInvoiceReference,
      resellerRef: config.testData.defaultInvoiceResellerRef
    },
    datacenters: [],
    total: {
      quantity: amount,
      unit: config.testData.defaultCurrency
    }
  };

  if (includeDatacenters) {
    response.datacenters.push({
      id: config.testData.datacenterId,
      name: config.testData.vdcName,
      location: config.testData.defaultLocation,
      productGroup: config.testData.defaultProductGroup,
      meters: [
        {
          meterId: config.testData.defaultMeterId,
          meterDesc: config.testData.defaultMeterDesc,
          productGroup: config.testData.defaultProductGroup,
          quantity: {
            quantity: config.testData.defaultQuantity,
            unit: config.testData.defaultQuantityUnit
          },
          rate: {
            quantity: amount,
            unit: config.testData.defaultCurrency
          },
          amount: {
            quantity: amount,
            unit: config.testData.defaultCurrency
          }
        }
      ],
      rebate: {
        amount: {
          quantity: 0,
          unit: config.testData.defaultCurrency
        }
      }
    });
  }

  return response;
}

/**
 * Generate products response data
 *
 * @param {Object} [params={}] - Parameters for response generation
 * @param {string|number} [params.contractId] - Contract ID (defaults to config value)
 * @param {number} [params.unitCost] - Unit cost (defaults to config value)
 * @returns {Object} Products response object with metadata, liability, and products array
 * @example
 * generateProductsResponse({ contractId: 441759, unitCost: 0.05 })
 */
function generateProductsResponse(params = {}) {
  const {
    contractId = config.testData.defaultContractId,
    unitCost = config.testData.defaultUnitCost
  } = params;

  return {
    metadata: {
      contractId: typeof contractId === 'string' ? parseInt(contractId) : contractId,
      customerId: config.testData.customerId,
      reference: String(contractId)
    },
    liability: config.testData.defaultProductLiability,
    products: [
      {
        meterId: config.testData.defaultProductMeterId,
        meterDesc: config.testData.defaultProductMeterDesc,
        unit: config.testData.defaultProductUnit,
        unitCost: {
          quantity: unitCost,
          unit: config.testData.defaultCurrency
        }
      }
    ]
  };
}

/**
 * Generate traffic response data
 *
 * @param {Object} [params={}] - Parameters for response generation
 * @param {string|number} [params.contractId] - Contract ID (defaults to config value)
 * @param {string} [params.period] - Period in YYYY-MM format (defaults to config value)
 * @param {boolean} [params.includeData=true] - Whether to include datacenter data
 * @returns {Object} Traffic response object with metadata and datacenters
 * @example
 * generateTrafficResponse({ contractId: 441759, period: '2020-01' })
 */
function generateTrafficResponse(params = {}) {
  const {
    contractId = config.testData.defaultContractId,
    period = config.testData.defaultPeriod,
    includeData = true
  } = params;

  const response = {
    metadata: {
      customerId: config.testData.customerId,
      contractId: typeof contractId === 'string' ? parseInt(contractId) : contractId,
      period: period
    },
    datacenters: []
  };

  if (includeData) {
    const lastDay = String(getLastDayOfMonth(period)).padStart(2, '0');
    response.datacenters.push({
      vdcUUID: config.testData.vdcUUID,
      name: config.testData.vdcName,
      data: [
        {
          resourceType: 'NIC',
          resourceUUID: config.testData.resourceUUID,
          from: `${period}-01T00:00:00.000Z`,
          to: `${period}-${lastDay}T23:59:59.999Z`,
          itemStub: config.testData.defaultTrafficItemStub,
          value: config.testData.defaultTrafficValue,
          valueDivisor: config.testData.defaultValueDivisor
        }
      ]
    });
  }

  return response;
}

/**
 * Generate utilization response data
 *
 * @param {Object} [params={}] - Parameters for response generation
 * @param {string|number} [params.contractId] - Contract ID (defaults to config value)
 * @param {string} [params.period] - Period in YYYY-MM format (defaults to config value)
 * @param {boolean} [params.includeData=true] - Whether to include datacenter data
 * @returns {Object} Utilization response object with metadata and datacenters
 * @example
 * generateUtilizationResponse({ contractId: 441759, period: '2020-01' })
 */
function generateUtilizationResponse(params = {}) {
  const {
    contractId = config.testData.defaultContractId,
    period = config.testData.defaultPeriod,
    includeData = true
  } = params;

  const response = {
    metadata: {
      customerId: config.testData.customerId,
      contractId: typeof contractId === 'string' ? parseInt(contractId) : contractId,
      period: period
    },
    datacenters: []
  };

  if (includeData) {
    const lastDay = String(getLastDayOfMonth(period)).padStart(2, '0');
    response.datacenters.push({
      vdcUUID: config.testData.vdcUUID,
      name: config.testData.vdcName,
      data: [
        {
          resourceType: 'SERVER',
          resourceUUID: config.testData.resourceUUID,
          from: `${period}-01T00:00:00.000Z`,
          to: `${period}-${lastDay}T23:59:59.999Z`,
          utilization: config.testData.defaultUtilization
        }
      ]
    });
  }

  return response;
}

module.exports = {
  generateEVNResponse,
  generateInvoiceResponse,
  generateProductsResponse,
  generateTrafficResponse,
  generateUtilizationResponse
};
