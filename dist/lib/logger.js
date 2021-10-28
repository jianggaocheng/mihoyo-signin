"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = __importDefault(require("log4js"));
let logLevel = !process.env.DEBUG ? 'info' : 'debug';
console.log(`LogLevel: ${logLevel}`);
log4js_1.default.configure({
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
exports.default = log4js_1.default.getLogger('mihoyo');
