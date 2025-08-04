const httpStatus = require('http-status');
const puppeteer = require('puppeteer');
const axe = require('axe-core');
const Scan = require('../models/scan.model');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create a scan
 * @param {Object} scanBody
 * @returns {Promise<Scan>}
 */
const createScan = async (scanBody) => {
  const scan = await Scan.create(scanBody);
  return scan;
};

/**
 * Get scan by id
 * @param {ObjectId} id
 * @returns {Promise<Scan>}
 */
const getScanById = async (id) => {
  const scan = await Scan.findById(id);
  if (!scan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Scan not found');
  }
  return scan;
};

/**
 * Get scans with pagination
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryScans = async (filter, options) => {
  const scans = await Scan.paginate(filter, options);
  return scans;
};

/**
 * Update scan by id
 * @param {ObjectId} scanId
 * @param {Object} updateBody
 * @returns {Promise<Scan>}
 */
const updateScanById = async (scanId, updateBody) => {
  const scan = await getScanById(scanId);
  Object.assign(scan, updateBody);
  await scan.save();
  return scan;
};

/**
 * Delete scan by id
 * @param {ObjectId} scanId
 * @returns {Promise<Scan>}
 */
const deleteScanById = async (scanId) => {
  const scan = await getScanById(scanId);
  await scan.remove();
  return scan;
};

/**
 * Run accessibility scan on a single URL
 * @param {string} url
 * @returns {Promise<Object>}
 */
const scanUrl = async (url) => {
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    // Navigate to URL
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Inject axe-core
    await page.addScriptTag({
      path: require.resolve('axe-core/axe.min.js')
    });

    // Run accessibility analysis
    const results = await page.evaluate(() => {
      return new Promise((resolve) => {
        axe.run((err, results) => {
          if (err) {
            resolve({ error: err.message });
          } else {
            resolve(results);
          }
        });
      });
    });

    if (results.error) {
      throw new Error(results.error);
    }

    return {
      url,
      timestamp: new Date(),
      violations: results.violations || [],
      passes: results.passes || [],
      inapplicable: results.inapplicable || [],
      incomplete: results.incomplete || []
    };

  } catch (error) {
    logger.error(`Error scanning URL ${url}: ${error.message}`);
    throw new Error(`Failed to scan ${url}: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

/**
 * Execute scan for multiple URLs
 * @param {ObjectId} scanId
 * @returns {Promise<Scan>}
 */
const executeScan = async (scanId) => {
  const scan = await getScanById(scanId);
  
  if (scan.status === 'running') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Scan is already running');
  }

  if (scan.status === 'completed') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Scan is already completed');
  }

  // Update status to running
  scan.status = 'running';
  scan.startedAt = new Date();
  await scan.save();

  try {
    const results = [];
    let totalViolations = 0;
    let totalPasses = 0;

    // Scan each URL
    for (const url of scan.urls) {
      try {
        const result = await scanUrl(url);
        results.push(result);
        
        // Count violations and passes
        totalViolations += result.violations.length;
        totalPasses += result.passes.length;
        
        logger.info(`Completed scan for ${url}: ${result.violations.length} violations, ${result.passes.length} passes`);
      } catch (error) {
        logger.error(`Failed to scan ${url}: ${error.message}`);
        results.push({
          url,
          timestamp: new Date(),
          error: error.message,
          violations: [],
          passes: [],
          inapplicable: [],
          incomplete: []
        });
      }
    }

    // Update scan with results
    scan.results = results;
    scan.status = 'completed';
    scan.completedAt = new Date();
    scan.totalViolations = totalViolations;
    scan.totalPasses = totalPasses;
    await scan.save();

    logger.info(`Scan ${scanId} completed: ${totalViolations} total violations, ${totalPasses} total passes`);
    return scan;

  } catch (error) {
    // Update scan with error
    scan.status = 'failed';
    scan.error = error.message;
    scan.completedAt = new Date();
    await scan.save();
    
    logger.error(`Scan ${scanId} failed: ${error.message}`);
    throw error;
  }
};

/**
 * Export scan results to CSV
 * @param {ObjectId} scanId
 * @returns {Promise<string>}
 */
const exportToCSV = async (scanId) => {
  const scan = await getScanById(scanId);
  
  if (scan.status !== 'completed') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Scan must be completed to export results');
  }

  let csv = 'URL,Timestamp,Violations,Passes,Inapplicable,Incomplete\n';
  
  for (const result of scan.results) {
    const violations = result.violations ? result.violations.length : 0;
    const passes = result.passes ? result.passes.length : 0;
    const inapplicable = result.inapplicable ? result.inapplicable.length : 0;
    const incomplete = result.incomplete ? result.incomplete.length : 0;
    
    csv += `"${result.url}","${result.timestamp}","${violations}","${passes}","${inapplicable}","${incomplete}"\n`;
  }

  return csv;
};

module.exports = {
  createScan,
  getScanById,
  queryScans,
  updateScanById,
  deleteScanById,
  executeScan,
  exportToCSV,
}; 