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
const utils_1 = __importDefault(require("./utils"));
const logger_1 = __importDefault(require("./logger"));
const md5_1 = __importDefault(require("md5"));
const lodash_1 = __importDefault(require("lodash"));
const superagent_1 = __importDefault(require("superagent"));
const APP_VERSION = "2.2.0";
class MihoYoApi {
    constructor() {
        this.DEVICE_ID = utils_1.default.randomString(32).toUpperCase();
        this.DEVICE_NAME = utils_1.default.randomString(lodash_1.default.random(1, 10));
    }
    forumSign(forumId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api-takumi.mihoyo.com/apihub/sapi/signIn?gids=${forumId}`;
            let res = yield superagent_1.default.post(url).set(this._getHeader()).timeout(10000);
            let resObj = JSON.parse(res.text);
            logger_1.default.debug(`ForumSign: ${res.text}`);
            return resObj;
        });
    }
    forumPostList(forumId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api-takumi.mihoyo.com/post/api/getForumPostList?forum_id=${forumId}&is_good=false&is_hot=false&page_size=20&sort_type=1`;
            let res = yield superagent_1.default.get(url).set(this._getHeader()).timeout(10000);
            let resObj = JSON.parse(res.text);
            logger_1.default.debug(`ForumList: ${res.text}`);
            return resObj;
        });
    }
    forumPostDetail(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api-takumi.mihoyo.com/post/api/getPostFull?post_id=${postId}`;
            let res = yield superagent_1.default.get(url).set(this._getHeader()).timeout(10000);
            let resObj = JSON.parse(res.text);
            logger_1.default.debug(`ForumDetail: ${res.text}`);
            return resObj;
        });
    }
    forumPostShare(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api-takumi.mihoyo.com/apihub/api/getShareConf?entity_id=${postId}&entity_type=1`;
            let res = yield superagent_1.default.get(url).set(this._getHeader()).timeout(10000);
            let resObj = JSON.parse(res.text);
            logger_1.default.debug(`ForumShare: ${res.text}`);
            return resObj;
        });
    }
    forumPostVote(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://api-takumi.mihoyo.com/apihub/sapi/upvotePost`;
            const upvotePostData = {
                "post_id": postId,
                "is_cancel": false
            };
            let res = yield superagent_1.default.post(url).set(this._getHeader()).send(JSON.stringify(upvotePostData));
            let resObj = JSON.parse(res.text);
            logger_1.default.debug(`ForumVote: ${res.text}`);
            return resObj;
        });
    }
    _getHeader() {
        const randomStr = utils_1.default.randomString(6);
        const timestamp = Math.floor(Date.now() / 1000);
        // iOS sign
        let sign = md5_1.default(`salt=b253c83ab2609b1b600eddfe974df47b&t=${timestamp}&r=${randomStr}`);
        return {
            'Cookie': process.env.COOKIE_STRING,
            'Content-Type': 'application/json',
            'User-Agent': 'Hyperion/67 CFNetwork/1128.0.1 Darwin/19.6.0',
            'Referer': 'https://app.mihoyo.com',
            'x-rpc-channel': 'appstore',
            'x-rpc-device_id': this.DEVICE_ID,
            'x-rpc-app_version': APP_VERSION,
            'x-rpc-device_model': 'iPhone11,8',
            'x-rpc-device_name': this.DEVICE_NAME,
            'x-rpc-client_type': '1',
            'DS': `${timestamp},${randomStr},${sign}`
            // 'DS': `1602569298,k0xfEh,07f4545f5d88eac59cb1257aef74a570`
        };
    }
}
exports.default = MihoYoApi;
