"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const logger_1 = __importDefault(require("./logger"));
const sleepAsync = (sleepms) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, sleepms);
    });
});
const randomSleepAsync = () => __awaiter(void 0, void 0, void 0, function* () {
    let sleep = 2 * 1000 + lodash_1.default.random(3 * 1000);
    logger_1.default.debug(`Sleep: ${sleep} ms`);
    yield sleepAsync(sleep);
});
const randomString = (length) => {
    let randomStr = '';
    for (let i = 0; i < length; i++) {
        randomStr += lodash_1.default.sample('abcdefghijklmnopqrstuvwxyz0123456789');
    }
    return randomStr;
};
exports.default = {
    sleepAsync,
    randomSleepAsync,
    randomString
};
