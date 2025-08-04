const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const scanSchema = mongoose.Schema(
  {
    urls: {
      type: [String],
      required: true,
      validate: {
        validator: function(urls) {
          return urls.length > 0;
        },
        message: 'At least one URL is required'
      }
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending'
    },
    results: {
      type: [{
        url: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        violations: [{
          id: String,
          impact: String,
          tags: [String],
          description: String,
          help: String,
          helpUrl: String,
          nodes: [{
            html: String,
            target: [String],
            failureSummary: String,
            impact: String
          }]
        }],
        passes: [{
          id: String,
          impact: String,
          tags: [String],
          description: String,
          help: String,
          helpUrl: String,
          nodes: [{
            html: String,
            target: [String],
            impact: String
          }]
        }],
        inapplicable: [{
          id: String,
          impact: String,
          tags: [String],
          description: String,
          help: String,
          helpUrl: String
        }],
        incomplete: [{
          id: String,
          impact: String,
          tags: [String],
          description: String,
          help: String,
          helpUrl: String,
          nodes: [{
            html: String,
            target: [String],
            impact: String
          }]
        }],
        timestamp: {
          type: Date,
          default: Date.now
        },
        url: String,
        violations: Array,
        passes: Array,
        inapplicable: Array,
        incomplete: Array
      }],
      default: []
    },
    error: {
      type: String,
      default: null
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    },
    totalViolations: {
      type: Number,
      default: 0
    },
    totalPasses: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
scanSchema.plugin(toJSON);
scanSchema.plugin(paginate);

/**
 * @typedef Scan
 */
const Scan = mongoose.model('Scan', scanSchema);

module.exports = Scan; 