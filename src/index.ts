import winston, { format } from 'winston';

export interface Config {
  level: string;
}

export interface LoggerParams {
  label: string;
  requestId: string;
  message: string | Record<string, unknown>;
  error?: string | Record<string, unknown>;
}

export type Logger = winston.Logger

const UNKNOWN_LABEL = 'UNKNOWN';
const colorizer = format.colorize();
const consoleLogFormatter = format.printf((msg) => {
  let _label = UNKNOWN_LABEL;
  let _requestId = UNKNOWN_LABEL;

  let { message } = msg;
  if (msg.requestId) {
    _requestId = `${msg.requestId.substring(msg.requestId.length - 6)}`;
  }
  if (msg.label) {
    _label = `${msg.label}`;
  }
  if (typeof message === 'object') {
    message = JSON.stringify(message);
  }

  const line = colorizer.colorize(
    msg.level,
    `${msg.timestamp} [${msg.module}] [${msg.level.toUpperCase()}] [${_label}] [${_requestId}]`,
  );
  if (msg.stack) {
    return `${line} - ${msg.stack}`;
  }
  return `${line} - ${message}`;
});

export const log = (filename: string, options: Config): Logger => {
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
