import onFinished from 'on-finished';

import type { Request, Response, NextFunction } from 'express-serve-static-core';
import type { BaselandLogger } from './logger';

export type RequestConfig = {
  logIpAddress?: boolean;
  logClientCaller?: boolean;
}

export type LogEvent = {
  label: string;
  method: string;
  url: string;
  requestId: string;
  clientCaller: string;
  message: string;
  statusCode?: string;
  duration?: number;
  ipAddress?: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
  }
}

const colorizeStatusCode = (statusCode: number): string => {
  let statusCodeColor = 0; // No color.

  if (statusCode >= 500) {
    statusCodeColor = 31; // Red
  } else if (statusCode >= 400) {
    statusCodeColor = 33; // Yellow
  } else if (statusCode >= 300) {
    statusCodeColor = 36; // Cyan
  } else if (statusCode >= 200) {
    statusCodeColor = 32; // Green
  }

  return `\x1B[${statusCodeColor}m${statusCode}\x1B[39m`;
};

const colorizeDuration = (duration: number): string => {
  let durationColor = 31; // Red

  // Durations are in milliseconds.
  if (duration < 200) {
    durationColor = 32; // Green
  } else if (duration < 500) {
    durationColor = 33; // Yellow
  }

  return `\x1B[${durationColor}m${duration}ms\x1B[39m`;
};

/**
 * Service agnostic request logger.
 *
 * @param {object} config - configuration object.
 * @param {boolean} [config.logCaller] - If set, will log the calling service for the request.
 * @param {boolean} [config.logIp] - If set, will log the clientIp of the request.
 * @param {boolean} [config.logUsername] - If set, will log the locals.member.username of the request.
 * @param {boolean} [config.logSessionId] - If set, will log the  request.
 * @param {object} logger - logger.
 *
 * @return {Function} Configured middleware.
 */
const requestLogger = (logger: BaselandLogger, config: RequestConfig) => {
  const logIpAddress = config.logIpAddress || false;
  const logClientCaller = config.logClientCaller || false;

  /**
   * Log an event per request.
   *
   * @param {object} request - Express request object.
   * @param {object} response - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  return function requestLogger(request: Request, response: Response, next: NextFunction) {
    const startAt = process.hrtime();

    /**
     * Log a request.
     */
    const logRequest = () => {
      const endAt = process.hrtime();

      const event: LogEvent = {
        label: 'request-logger',
        method: request.method,
        url: request.url,
        requestId: request.id || 'UNKNOWN',
        clientCaller: 'UNKNOWN',
        message: '',
      };

      if (response.statusCode) {
        event.statusCode = colorizeStatusCode(response.statusCode);
      }

      if (logIpAddress) {
        event.ipAddress = request.get('x-forwarded-for') || request.socket.remoteAddress;
      }

      if (logClientCaller) {
        event.clientCaller = request.get('client-caller') || 'UNKNOWN';
      }
      // Durations are in milliseconds
      event.message = colorizeDuration(Math.round((endAt[0] - startAt[0]) * 1000 + (endAt[1] - startAt[1]) * 1e-6));
      logger.info(event);
    };

    // log when response finished
    onFinished(response, logRequest);

    next();
  };
};

export default requestLogger;
