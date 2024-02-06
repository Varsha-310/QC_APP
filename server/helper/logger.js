import log4js from 'log4js';
import path from 'path';

// Log4js configuration
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
        "type": "dateFile",
        "filename": "logs/app",
        "pattern": ".yyyy-MM-dd",
        "layout": {
          "type": "pattern",
          "pattern": "%d{ISO8601_WITH_TZ_OFFSET} [%p] %c - %m%n"
        }
    }
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'debug' }
  }
});

// Export the logger
export const logger = log4js.getLogger('app');
