const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { scanService } = require('../services');
const pick = require('../utils/pick');

const createScan = catchAsync(async (req, res) => {
  const scan = await scanService.createScan(req.body);
  res.status(httpStatus.CREATED).send(scan);
});

const getScans = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await scanService.queryScans(filter, options);
  res.send(result);
});

const getScan = catchAsync(async (req, res) => {
  const scan = await scanService.getScanById(req.params.scanId);
  res.send(scan);
});

const updateScan = catchAsync(async (req, res) => {
  const scan = await scanService.updateScanById(req.params.scanId, req.body);
  res.send(scan);
});

const deleteScan = catchAsync(async (req, res) => {
  await scanService.deleteScanById(req.params.scanId);
  res.status(httpStatus.NO_CONTENT).send();
});

const executeScan = catchAsync(async (req, res) => {
  const scan = await scanService.executeScan(req.params.scanId);
  res.send(scan);
});

const exportScanResults = catchAsync(async (req, res) => {
  const { csv, filePath } = await scanService.exportToCSV(req.params.scanId);
  
  // Send response with file path information
  res.status(httpStatus.OK).json({
    message: 'CSV file generated successfully',
    filePath: filePath,
    downloadUrl: `/downloads/scan-${req.params.scanId}-results.csv`
  });
});

const downloadCSV = catchAsync(async (req, res) => {
  const { csv } = await scanService.exportToCSV(req.params.scanId);
  
  // Send the CSV content as attachment
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="scan-${req.params.scanId}-results.csv"`);
  res.send(csv);
});

module.exports = {
  createScan,
  getScans,
  getScan,
  updateScan,
  deleteScan,
  executeScan,
  exportScanResults,
  downloadCSV,
}; 