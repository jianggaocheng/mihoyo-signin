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
const superagent_1 = __importDefault(require("superagent"));
const logger_1 = __importDefault(require("../logger"));
class QyWechatNotifier {
    constructor(webHook) {
        this.webHook = webHook;
    }
    sendMarkdown(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message) {
                message = '';
            }
            const form = {
                msgtype: 'markdown',
                markdown: {
                    content: message
                }
            };
            logger_1.default.debug(`Send push ${JSON.stringify(form)}`);
            let pushResult = yield superagent_1.default
                .post(this.webHook)
                .set('Content-Type', 'application/json')
                .send(JSON.stringify(form));
            pushResult = JSON.parse(pushResult.text);
            if (pushResult.errcode != 0) {
                logger_1.default.error(`Push failed: code [${pushResult.errcode}]  message [${pushResult.errmsg}]`);
            }
            else {
                logger_1.default.debug(`Push failed: code [${pushResult.errcode}]  message [${pushResult.errmsg}]`);
            }
        });
    }
}
exports.default = QyWechatNotifier;
