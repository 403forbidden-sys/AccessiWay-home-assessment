const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { Scan } = require('../../src/models');
const { scanOne, scanTwo } = require('../fixtures/scan.fixture');

setupTestDB();

describe('Scan routes', () => {
  describe('POST /v1/scan', () => {
    test('should return 201 and successfully create scan if data is ok', async () => {
      const res = await request(app)
        .post('/scan')
        .send({
          urls: ['https://example.com'],
        })
        .expect(httpStatus.CREATED);

      expect(res.body).toEqual({
        id: expect.anything(),
        urls: ['https://example.com'],
        status: 'pending',
        results: [],
        error: null,
        startedAt: expect.anything(),
        completedAt: null,
        totalViolations: 0,
        totalPasses: 0,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });

      const dbScan = await Scan.findById(res.body.id);
      expect(dbScan).toBeDefined();
      expect(dbScan).toMatchObject({
        urls: ['https://example.com'],
        status: 'pending',
      });
    });

    test('should return 400 error if urls is invalid', async () => {
      const res = await request(app)
        .post('/scan')
        .send({
          urls: ['invalid-url'],
        })
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.code).toBe(400);
    });

    test('should return 400 error if urls array is empty', async () => {
      const res = await request(app)
        .post('/scan')
        .send({
          urls: [],
        })
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.code).toBe(400);
    });
  });

  describe('GET /v1/scan', () => {
    test('should return 200 and apply default query options', async () => {
      await Scan.insertMany([scanOne, scanTwo]);

      const res = await request(app)
        .get('/scan')
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 2,
      });
      expect(res.body.results).toHaveLength(2);
      expect(res.body.results[0]).toEqual({
        id: expect.anything(),
        urls: expect.any(Array),
        status: expect.any(String),
        results: expect.any(Array),
        error: expect.anything(),
        startedAt: expect.anything(),
        completedAt: expect.anything(),
        totalViolations: expect.any(Number),
        totalPasses: expect.any(Number),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      });
    });

    test('should return 200 and apply filter query options', async () => {
      await Scan.insertMany([scanOne, scanTwo]);

      const res = await request(app)
        .get('/scan')
        .query({ status: 'completed' })
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        results: expect.any(Array),
        page: 1,
        limit: 10,
        totalPages: 1,
        totalResults: 1,
      });
      expect(res.body.results).toHaveLength(1);
      expect(res.body.results[0].status).toBe('completed');
    });
  });

  describe('GET /v1/scan/:scanId', () => {
    test('should return 200 and the scan object if data is ok', async () => {
      const scan = await Scan.create(scanOne);

      const res = await request(app)
        .get(`/scan/${scan.id}`)
        .send()
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: scan.id,
        urls: scan.urls,
        status: scan.status,
        results: scan.results,
        error: scan.error,
        startedAt: scan.startedAt.toISOString(),
        completedAt: scan.completedAt ? scan.completedAt.toISOString() : null,
        totalViolations: scan.totalViolations,
        totalPasses: scan.totalPasses,
        createdAt: scan.createdAt.toISOString(),
        updatedAt: scan.updatedAt.toISOString(),
      });
    });

    test('should return 400 error if scanId is invalid', async () => {
      const res = await request(app)
        .get('/scan/invalidId')
        .send()
        .expect(httpStatus.BAD_REQUEST);

      expect(res.body.code).toBe(400);
    });

    test('should return 404 error if scan is not found', async () => {
      const res = await request(app)
        .get('/scan/5ebac534954b54139806c112')
        .send()
        .expect(httpStatus.NOT_FOUND);

      expect(res.body.code).toBe(404);
    });
  });

  describe('PATCH /v1/scan/:scanId', () => {
    test('should return 200 and successfully update scan if data is ok', async () => {
      const scan = await Scan.create(scanOne);
      const updateBody = {
        urls: ['https://updated-example.com'],
        status: 'pending',
      };

      const res = await request(app)
        .put(`/scan/${scan.id}`)
        .send(updateBody)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        id: scan.id,
        urls: updateBody.urls,
        status: updateBody.status,
        results: scan.results,
        error: scan.error,
        startedAt: scan.startedAt.toISOString(),
        completedAt: scan.completedAt ? scan.completedAt.toISOString() : null,
        totalViolations: scan.totalViolations,
        totalPasses: scan.totalPasses,
        createdAt: scan.createdAt.toISOString(),
        updatedAt: expect.anything(),
      });

      const dbScan = await Scan.findById(scan.id);
      expect(dbScan).toBeDefined();
      expect(dbScan).toMatchObject({
        urls: updateBody.urls,
        status: updateBody.status,
      });
    });

    test('should return 404 error if scan is not found', async () => {
      const res = await request(app)
        .put('/scan/5ebac534954b54139806c112')
        .send({ urls: ['https://example.com'] })
        .expect(httpStatus.NOT_FOUND);

      expect(res.body.code).toBe(404);
    });
  });

  describe('DELETE /v1/scan/:scanId', () => {
    test('should return 204 if data is ok', async () => {
      const scan = await Scan.create(scanOne);

      await request(app)
        .delete(`/scan/${scan.id}`)
        .send()
        .expect(httpStatus.NO_CONTENT);

      const dbScan = await Scan.findById(scan.id);
      expect(dbScan).toBeNull();
    });

    test('should return 404 error if scan is not found', async () => {
      const res = await request(app)
        .delete('/scan/5ebac534954b54139806c112')
        .send()
        .expect(httpStatus.NOT_FOUND);

      expect(res.body.code).toBe(404);
    });
  });
}); 