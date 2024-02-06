
import pkg from 'log4js';
const { Log4js } = pkg;

// Log4js configuration
Log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'file',
      filename: 'logs/app.log',
      maxLogSize: 10485760,
      backups: 3,
      category: 'app'
    }
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'debug' }
  }
});

// Export the logger
export const logger = Log4js.getLogger('app');
