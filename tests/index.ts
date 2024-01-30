import log, { requestLogger } from '../src/';
import express from 'express';
import request from 'supertest';

import type { Config, BaselandLogger } from '../src/lib/logger';
import { Express, Request, Response } from 'express-serve-static-core';

context('tests', async () => {
  const config: Config = {
    level: process.env.LOG_LEVEL || 'info',
  };

  describe('src/lib/logger', () => {
    let logger: BaselandLogger;

    beforeEach(() => {
      logger = log('/path/to/file.txt', config);
    });

    it('should print a simple message to the logger', () => {
      logger.info('message');
    });

    it('should print a object message', () => {
      logger.info({});
    });

    it('should print an error message and stack', () => {
      const error = new Error('red alert!');
      logger.info({ error });
    });

    it('should print an log message with a `requestId`', () => {
      const requestId = 'some-request-id';
      logger.info({ label: 'label', requestId, message: 'has request id' });
    });

    it('should print an log message with a `method`', () => {
      logger.info({ label: 'label', method: 'GET', message: 'has http method' });
    });

    it('should print an log message with a `statusCode`', () => {
      logger.info({ label: 'label', statusCode: 201, message: 'has http status code' });
    });

    it('should print an log message with a `duration`', () => {
      logger.info({ label: 'label', duration: 15, message: 'has request duration' });
    });

  });

  describe('src/lib/requestLogger', async () => {
    let logger: BaselandLogger;
    let app: Express;
    beforeEach(() => {
      logger = log('/path/to/file.txt', config);
    });

    it('should do a thing', async () => {
      app = express();
      app.use(requestLogger(logger, { logIpAddress: true, logClientCaller: true }));

      app.get('/', (request: Request, response: Response) => {
        return response.send('OK');
      });
      await request(app).get('/').expect(200);
    });
  });
});
