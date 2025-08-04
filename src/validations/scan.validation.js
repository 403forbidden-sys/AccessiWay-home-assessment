const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createScan = {
  body: Joi.object().keys({
    urls: Joi.array().items(Joi.string().uri().required()).min(1).required(),
  }),
};

const getScans = {
  query: Joi.object().keys({
    status: Joi.string().valid('pending', 'running', 'completed', 'failed'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getScan = {
  params: Joi.object().keys({
    scanId: Joi.string().custom(objectId),
  }),
};

const updateScan = {
  params: Joi.object().keys({
    scanId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      urls: Joi.array().items(Joi.string().uri().required()).min(1),
      status: Joi.string().valid('pending', 'running', 'completed', 'failed'),
    })
    .min(1),
};

const deleteScan = {
  params: Joi.object().keys({
    scanId: Joi.string().custom(objectId),
  }),
};

const executeScan = {
  params: Joi.object().keys({
    scanId: Joi.string().custom(objectId),
  }),
};

const exportScan = {
  params: Joi.object().keys({
    scanId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createScan,
  getScans,
  getScan,
  updateScan,
  deleteScan,
  executeScan,
  exportScan,
}; 