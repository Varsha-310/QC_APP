import log4js from 'log4js';
import path from 'path';


const rightNow = new Date();
const res = rightNow.toISOString().slice(0, 10).replace(/-/g, "_");
// Log4js configuration
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
        "type": "file",
        "filename": `logs/${res}.log`
        ,
        "maxLogSize": 10485760,
        "backups": 3,
        "category": "app"
    }
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'debug' }
  }
});

// Export the logger
export const logger = log4js.getLogger('app');
