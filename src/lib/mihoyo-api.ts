import utils from './utils';
import logger from './logger';
import md5 from 'md5';
import _ from 'lodash';
import superagent from 'superagent';

const APP_VERSION = "2.2.0";

export default class MihoYoApi {
  DEVICE_ID = utils.randomString(32).toUpperCase();
  DEVICE_NAME = utils.randomString(_.random(1, 10));

  async forumSign (forumId: string): Promise<any> {
    const url = `https://api-takumi.mihoyo.com/apihub/sapi/signIn?gids=${forumId}`;

    let res = await superagent.post(url).set(this._getHeader()).timeout(10000);
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

  _getHeader () {
    const randomStr = utils.randomString(6);
    const timestamp = Math.floor(Date.now() / 1000)
  
    // iOS sign
    let sign = md5(`salt=b253c83ab2609b1b600eddfe974df47b&t=${timestamp}&r=${randomStr}`);

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
      'x-rpc-client_type': '1', // 1 - iOS, 2 - Android, 4 - Web
      'DS': `${timestamp},${randomStr},${sign}`
      // 'DS': `1602569298,k0xfEh,07f4545f5d88eac59cb1257aef74a570`
    }
  }
}