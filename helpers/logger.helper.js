const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  // if any key is unused, it will be stripped off when stringified

  let logMessage = {
    level: level | 'info',
    message: {
      endpoint: meta.endpoint,
      message: message,
      data: meta.data || {},
      timestamp: timestamp,
    },
  };

  if (meta.error) {
    logMessage.stack = meta.error.stack;
  }

  return JSON.stringify(logMessage);
});

const options = {
  handleExceptions: true,
  json: true,
};
const ISTtimestamp = function () {
  // Remove Z at the end and add +0530 to recognize as IST timestamp
  return new Date(Date.now() + 330 * 60 * 1000).toJSON().slice(0, -1) + '+0530';
};

const logger = createLogger({
  format: combine(
    errors({ stack: true }),
    timestamp({
      format: ISTtimestamp,
    }),
    logFormat
  ),
  transports: [new transports.Console({ options })],
});

logger.setLogLevel = function (level) {
  logger.level = level || 'info';
};

module.exports = logger;
