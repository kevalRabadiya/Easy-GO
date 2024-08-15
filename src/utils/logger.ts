import { createLogger, format, transports, Logger } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp}  ${level}: ${message}`;
});

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5
};

const logger: Logger = createLogger({
  levels: logLevels,
  format: combine(
    format.colorize(),
    timestamp({ format: "HH:mm:ss" }),
    myFormat
  ),
  transports: [new transports.Console()]
});

export default logger;
