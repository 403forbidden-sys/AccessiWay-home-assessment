const mongoose = require('mongoose');
const { Scan } = require('../../src/models');

const scanOne = {
  _id: new mongoose.Types.ObjectId(),
  urls: ['https://example.com'],
  status: 'completed',
  results: [
    {
      url: 'https://example.com',
      timestamp: new Date(),
      violations: [
        {
          id: 'color-contrast',
          impact: 'serious',
          tags: ['wcag2aa', 'wcag143'],
          description: 'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
          help: 'Elements must meet minimum color contrast ratio requirements',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/color-contrast',
          nodes: [
            {
              html: '<button class="btn">Submit</button>',
              target: ['button.btn'],
              failureSummary: 'Fix any of the following:\n  Element has insufficient color contrast of 2.51 (foreground color: #ffffff, background color: #f0f0f0, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1',
              impact: 'serious'
            }
          ]
        }
      ],
      passes: [
        {
          id: 'document-title',
          impact: null,
          tags: ['wcag2a', 'wcag242'],
          description: 'Ensures each HTML document contains a non-empty <title> element',
          help: 'Documents must have a title element to aid in navigation',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/document-title',
          nodes: [
            {
              html: '<title>Example Domain</title>',
              target: ['title'],
              impact: null
            }
          ]
        }
      ],
      inapplicable: [],
      incomplete: []
    }
  ],
  error: null,
  startedAt: new Date(),
  completedAt: new Date(),
  totalViolations: 1,
  totalPasses: 1
};

const scanTwo = {
  _id: new mongoose.Types.ObjectId(),
  urls: ['https://google.com', 'https://github.com'],
  status: 'pending',
  results: [],
  error: null,
  startedAt: new Date(),
  completedAt: null,
  totalViolations: 0,
  totalPasses: 0
};

const insertScans = async (scans) => {
  await Scan.insertMany(scans.map((scan) => ({ ...scan })));
};

module.exports = {
  scanOne,
  scanTwo,
  insertScans,
}; 