import { compact } from 'lodash';
import winston, { format } from 'winston';

export interface Config {
  level: string;
}

export interface LoggerParams {
  label: string;
  requestId: string;
  message: string | Record<string, unknown> | Error;
}

export type BaselandLogger = winston.Logger

const UNKNOWN_LABEL = 'UNKNOWN';
const colorizer = format.colorize();
export const consoleLogFormatter = format.printf((raw) => {
  let _message;
  let data;

  // when the message property is a string, the raw log is flat
  if (typeof raw.message === 'string') {
    data = raw;
    _message = raw.message;
  }

  // when the message property is a string, the raw log is structured however...
  if (typeof raw.message === 'object') {
    data = raw;
    _message = JSON.stringify(raw.message);

    // if the `error` property exists, then the "meta" properties are nested under the `message` object
    if (raw.message.error) {
      data = raw.message;
      _message = raw.message.error.stack;
    }
  }

  const logEvent = {
    timestamp: raw.timestamp,
    module: raw.module,
    level: raw.level.toLocaleLowerCase(),
    label: data.label || UNKNOWN_LABEL,
    requestId: UNKNOWN_LABEL,
    ipAddress: data.ipAddress || null,
    url: data.url || null,
    method: data.method || null,
    statusCode: data.statusCode || null,
    duration: data.duration || null,
  };

  if (data.requestId) {
    logEvent.requestId = `${data.requestId.substring(data.requestId.length - 6)}`;
  }

  if (data.method) {
    logEvent.method = data.method.toLocaleUpperCase();
  }

  if (data.statusCode) {
    logEvent.statusCode = data.statusCode;
  }

  if (data.duration) {
    logEvent.duration = `${data.duration}ms`;
  }

  const render = compact(Object.values(logEvent));
  const line = colorizer.colorize(
    raw.level,
    `[${render.join('] [')}]`,
  );
  return `${line} - ${_message}`;
});

export const log = (filename: string, options: Config): BaselandLogger => {
  const _options = {
    level: options.level || 'info',
  };
  return winston.createLogger({
    defaultMeta: {
      module: filename.replace(process.cwd(), ''),
    },
    transports: [
      new winston.transports.Console({
        level: _options.level,
        format: winston.format.combine(
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.errors({ stack: true }),
          consoleLogFormatter,
        ),
      }),
    ],
  });
};
