// Mock Puppeteer for testing
jest.mock('puppeteer', () => ({
  launch: jest.fn().mockResolvedValue({
    newPage: jest.fn().mockResolvedValue({
      setViewport: jest.fn().mockResolvedValue(),
      goto: jest.fn().mockResolvedValue(),
      addScriptTag: jest.fn().mockResolvedValue(),
      evaluate: jest.fn().mockResolvedValue({
        violations: [],
        passes: [],
        inapplicable: [],
        incomplete: []
      }),
      close: jest.fn().mockResolvedValue()
    }),
    close: jest.fn().mockResolvedValue()
  })
}));

// Mock axe-core for testing
jest.mock('axe-core', () => ({
  run: jest.fn().mockImplementation((callback) => {
    callback(null, {
      violations: [],
      passes: [],
      inapplicable: [],
      incomplete: []
    });
  })
})); 