const index = require('winston');
require('winston-daily-rotate-file');

const alignedWithColorsAndTime = index.format.combine(
  index.format.colorize(),
  index.format.timestamp(),
  index.format.align(),
  index.format.printf(info => {
    const { level, message, timestamp } = info;
    return `${timestamp} [${level}]: ${message}`;
  })
);

const transports = [
  new index.transports.Console({
    level: 'debug',
    format: alignedWithColorsAndTime,
  }),
  new index.transports.DailyRotateFile({
    filename: 'logs/errors-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '1m',
    maxFiles: '1d',
  }),
];

const logger = index.createLogger({
  level: 'debug',
  transports,
});

logger.error = err => {
  if (err instanceof Error) {
    logger.log({ level: 'error', message: `${err.stack || err}` });
  } else {
    logger.log({ level: 'error', message: err });
  }
};

module.exports.logger = logger;
