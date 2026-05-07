import { createLogger, transports } from 'winston';

const logger = createLogger({
  transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' })
    ]
});

export { logger }