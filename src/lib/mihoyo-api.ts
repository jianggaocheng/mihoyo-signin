import utils from './utils';
import logger from './logger';
import md5 from 'md5';
import _ from 'lodash';
import superagent from 'superagent';

const APP_VERSION = "2.34.1";

export default class MihoYoApi {
  DEVICE_ID = utils.randomString(32).toUpperCase();
  DEVICE_NAME = utils.randomString(_.random(1, 10));

  async forumSign (forumId: string): Promise<any> {
    const url = "https://api-takumi.mihoyo.com/apihub/app/api/signIn";
    const signPostData = { gids: forumId };
    let res = await superagent
      .post(url)
      .set(this._getHeader("signIn", JSON.stringify(signPostData)))
      .timeout(10000)
      .send(JSON.stringify(signPostData));
    let resObj = JSON.parse(res.text);
    logger.debug(`ForumSign: ${res.text}`);

    return resObj;
  }

  async forumPostList (forumId: string): Promise<any> {
    const url = `https://api-takumi.mihoyo.com/post/api/getForumPostList?forum_id=${forumId}&is_good=false&is_hot=false&page_size=20&sort_type=1`;

    let res = await superagent.get(url).set(this._getHeader()).timeout(10000);
    let resObj = JSON.parse(res.text);
    logger.debug(`ForumList: ${res.text}`)
    return resObj;
  }

  async forumPostDetail (postId: string): Promise<any> {
    const url = `https://api-takumi.mihoyo.com/post/api/getPostFull?post_id=${postId}`;

    let res = await superagent.get(url).set(this._getHeader()).timeout(10000);
    let resObj = JSON.parse(res.text);
    logger.debug(`ForumDetail: ${res.text}`)
    return resObj;
  }

  async forumPostShare (postId: string): Promise<any> {
    const url = `https://api-takumi.mihoyo.com/apihub/api/getShareConf?entity_id=${postId}&entity_type=1`;

    let res = await superagent.get(url).set(this._getHeader()).timeout(10000);
    let resObj = JSON.parse(res.text);
    logger.debug(`ForumShare: ${res.text}`)
    return resObj;
  }

  async forumPostVote (postId: string): Promise<any> {
    const url = `https://api-takumi.mihoyo.com/apihub/sapi/upvotePost`;
    const upvotePostData = {
      "post_id": postId,
      "is_cancel": false
    }

    let res = await superagent.post(url).set(this._getHeader()).send(JSON.stringify(upvotePostData));
    let resObj = JSON.parse(res.text);
    logger.debug(`ForumVote: ${res.text}`)
    return resObj;
  }

  _getHeader (task?: "signIn" | "vote" | "share" | "detail" | "list", b?: string) {
    const randomStr = utils.randomString(6);
    const timestamp = Math.floor(Date.now() / 1000);

    // Android sign
    let sign = md5(`salt=z8DRIUjNDT7IT5IZXvrUAxyupA1peND9&t=${timestamp}&r=${randomStr}`);
    let DS = `${timestamp},${randomStr},${sign}`;
    if (task === "signIn") {
      const randomInt = Math.floor(Math.random() * (200000 - 100001) + 100001);
      sign = md5(`salt=t0qEgfub6cvueAPgR5m9aQWWVciEer7v&t=${timestamp}&r=${randomInt}&b=${b}&q=`);
      DS = `${timestamp},${randomInt},${sign}`;
    }

    return {
      'Cookie': process.env.COOKIE_STRING,
      "Content-Type": "application/json",
      "User-Agent": "okhttp/4.8.0",
      'Referer': "https://app.mihoyo.com",
      'Host': "bbs-api.mihoyo.com",
      "x-rpc-device_id": this.DEVICE_ID,
      "x-rpc-app_version": APP_VERSION,
      "x-rpc-device_name": this.DEVICE_NAME,
      "x-rpc-client_type": "2", // 1 - iOS, 2 - Android, 4 - Web
      "x-rpc-device_model": "Mi 10",
      "x-rpc-channel": "miyousheluodi",
      "x-rpc-sys_version": "6.0.1",
      DS,
    };
  }
}
