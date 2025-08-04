const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const scanValidation = require('../../validations/scan.validation');
const scanController = require('../../controllers/scan.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(scanValidation.createScan), scanController.createScan)
  .get(scanController.getScans);

router
  .route('/:scanId')
  .get(validate(scanValidation.getScan), scanController.getScan)
  .put(validate(scanValidation.updateScan), scanController.updateScan)
  .delete(validate(scanValidation.deleteScan), scanController.deleteScan);

router
  .route('/:scanId/execute')
  .post(validate(scanValidation.executeScan), scanController.executeScan);

router
  .route('/:scanId/export')
  .get(validate(scanValidation.exportScan), scanController.exportScanResults);

router
  .route('/:scanId/download')
  .get(validate(scanValidation.exportScan), scanController.downloadCSV);

module.exports = router; 