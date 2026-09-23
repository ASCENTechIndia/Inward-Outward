// const winston = require("winston");
// require("winston-daily-rotate-file");

// const logFormat = winston.format.printf(({ timestamp, level, message }) => {
//   return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
// });

// const createTransport = (filename, level) =>
//   new winston.transports.DailyRotateFile({
//     filename: `logs/${filename}-%DATE%.log`,
//     datePattern: "YYYY-MM-DD",
//     zippedArchive: false,
//     maxSize: "20m",
//     maxFiles: "14d", // Keep logs for 14 days
//     level,
//     format: winston.format.combine(
//       winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
//       logFormat
//     ),
//   });

// const logger = winston.createLogger({
//   transports: [
//     createTransport("performance", "info"),
//     createTransport("error", "error"),
//   ],
// });

// // Optional: log to console in development
// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.combine(winston.format.colorize(), logFormat),
//     })
//   );
// }

// module.exports = logger;

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'error.log') })
  ]
});

module.exports = logger;
