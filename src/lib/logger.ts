import log4js from 'log4js';

let logLevel = !process.env.DEBUG ? 'info' : 'debug';
console.log(`LogLevel: ${logLevel}`);

log4js.configure({
  appenders: {
    file: { 
      type: 'file', 
      filename: 'log/mihoyo.log', 
      maxLogSize: 10485760, 
      backups: 3, 
      compress: true
    },
    console: { 
      type: 'stdout'
    },
    infoFilter: {
      type: 'logLevelFilter',
      appender: 'console',
      level: logLevel
    }
  },
  categories: {
    default: { appenders: ['console'], level: 'info' },
    'mihoyo': { appenders: ['file', 'infoFilter'], level: 'debug' }
  }
});

export default log4js.getLogger('mihoyo');