"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const logger_1 = __importDefault(require("./lib/logger"));
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const promise_retry_1 = __importDefault(require("promise-retry"));
const qy_wechat_notifier_1 = __importDefault(require("./lib/notifier/qy-wechat-notifier"));
const utils_1 = __importDefault(require("./lib/utils"));
const mihoyo_api_1 = __importDefault(require("./lib/mihoyo-api"));
const ForumData = __importStar(require("./data.json"));
// 0. Golbal init
// Date
const START = (0, moment_1.default)().unix();
const TODAY_DATE = (0, moment_1.default)().format('YYYY-MM-DD');
const RETRY_OPTIONS = {
    retries: 3,
    minTimeout: 5000,
    maxTimeout: 10000
};
// Runtime environment check
if (lodash_1.default.isEmpty(process.env.COOKIE_STRING)) {
    logger_1.default.error('环境变量 COOKIE_STRING 未配置，退出...');
    process.exit();
}
;
// Register Notifier 
logger_1.default.info(`开始注册通知`);
const notifierList = [];
// Notifier - QyWechat
if (!lodash_1.default.isEmpty(process.env.QY_WECHAT)) {
    logger_1.default.info(`初始化企业微信通知`);
    notifierList.push(new qy_wechat_notifier_1.default(process.env.QY_WECHAT));
}
const sendReport = (message) => {
    lodash_1.default.forEach(notifierList, (notifier) => {
        notifier.sendMarkdown(message);
    });
};
const miHoYoApi = new mihoyo_api_1.default();
logger_1.default.info(`DeviceID: ${miHoYoApi.DEVICE_ID} ${miHoYoApi.DEVICE_NAME}`);
let resultMessage = `**Mihoyo 签到  ${TODAY_DATE}**\n\n`;
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Execute task
    for (let forum of ForumData.default) {
        resultMessage += `**${forum.name}**\n`;
        try {
            // 1 BBS Sign
            let resObj = yield (0, promise_retry_1.default)((retry, number) => {
                logger_1.default.info(`开始签到: [${forum.name}] 尝试次数: ${number}`);
                return miHoYoApi.forumSign(forum.forumId).catch((e) => {
                    logger_1.default.error(`${forum.name} 签到失败: [${e.message}] 尝试次数: ${number}`);
                    return retry(e);
                });
            }, RETRY_OPTIONS);
            logger_1.default.info(`${forum.name} 签到结果: [${resObj.message}]`);
            resultMessage += `签到: [${resObj.message}]\n`;
        }
        catch (e) {
            logger_1.default.error(`${forum.name} 签到失败 [${e.message}]`);
            resultMessage += `签到失败: [${e.message}]\n`;
        }
        yield utils_1.default.randomSleepAsync();
    }
    // Execute task
    for (let forum of ForumData.default) {
        resultMessage += `\n**${forum.name}**\n`;
        try {
            // 2 BBS list post
            let resObj = yield (0, promise_retry_1.default)((retry, number) => {
                logger_1.default.info(`读取帖子列表: [${forum.name}] 尝试次数: ${number}`);
                return miHoYoApi.forumPostList(forum.forumId).catch((e) => {
                    logger_1.default.error(`${forum.name} 读取帖子列表失败: [${e.message}] 尝试次数: ${number}`);
                    return retry(e);
                });
            }, RETRY_OPTIONS);
            logger_1.default.info(`${forum.name} 读取列表成功 [${resObj.message}]，读取到 [${resObj.data.list.length}] 条记录`);
            let postList = resObj.data.list;
            for (let post of postList) {
                post = post.post;
                // 2.1 BBS read post
                let resObj = yield (0, promise_retry_1.default)((retry, number) => {
                    logger_1.default.info(`读取帖子: [${post.subject}] 尝试次数: ${number}`);
                    return miHoYoApi.forumPostDetail(post['post_id']).catch((e) => {
                        logger_1.default.error(`${forum.name} 读取帖子失败: [${e.message}] 尝试次数: ${number}`);
                        return retry(e);
                    });
                }, RETRY_OPTIONS);
                logger_1.default.info(`${forum.name} [${post.subject}] 读取成功 [${resObj.message}]`);
                yield utils_1.default.randomSleepAsync();
                // 2.2 BBS vote post
                resObj = yield (0, promise_retry_1.default)((retry, number) => {
                    logger_1.default.info(`点赞帖子: [${post.subject}] 尝试次数: ${number}`);
                    return miHoYoApi.forumPostVote(post['post_id']).catch((e) => {
                        logger_1.default.error(`${forum.name} 点赞帖子失败: [${e.message}] 尝试次数: ${number}`);
                        return retry(e);
                    });
                }, RETRY_OPTIONS);
                logger_1.default.info(`${forum.name} [${post.subject}] 点赞成功 [${resObj.message}]`);
                yield utils_1.default.randomSleepAsync();
            }
            // 2.3 BBS share post
            let sharePost = postList[0].post;
            resObj = yield (0, promise_retry_1.default)((retry, number) => {
                logger_1.default.info(`分享帖子: [${sharePost.subject}] 尝试次数: ${number}`);
                return miHoYoApi.forumPostShare(sharePost['post_id']).catch((e) => {
                    logger_1.default.error(`${forum.name} 分享帖子失败: [${e.message}] 尝试次数: ${number}`);
                    return retry(e);
                });
            }, RETRY_OPTIONS);
        }
        catch (e) {
            logger_1.default.error(`${forum.name} 读帖点赞分享失败 [${e.message}]`);
            resultMessage += `读帖点赞分享: 失败 [${e.message}]\n`;
        }
        resultMessage += `读帖点赞分享: 成功\n`;
        yield utils_1.default.randomSleepAsync();
    }
    const END = (0, moment_1.default)().unix();
    logger_1.default.info(`运行结束, 用时 ${END - START} 秒`);
    resultMessage += `\n用时 ${END - START} 秒`;
    sendReport(resultMessage);
}))();
