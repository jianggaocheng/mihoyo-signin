const superagent = require('superagent');
const util = require('util');
const _ = require('lodash');
const md5 = require('md5');


const URL_LOGIN_TICKET = "https://webapi.account.mihoyo.com/Api/cookie_accountinfo_by_loginticket?login_ticket=%s";
const URL_QUERY_SIGN_IN_STATUS = "https://api-takumi.mihoyo.com/apihub/api/querySignInStatus?gids=1";
const URL_GET_MULTI_TOKEN = "https://api-takumi.mihoyo.com/auth/api/getMultiTokenByLoginTicket?login_ticket=%s&token_types=3&uid=%s";
const URL_FORUM_SIGN_IN = "https://api-takumi.mihoyo.com/apihub/api/signIn";
const URL_FORUM_POST_LIST = "https://api-community.mihoyo.com/community/forum/home/forumPostList?forum_id=%s&is_good=false&is_hot=false&page_size=20&sort=create";
const URL_FORUM_POST_DETAIL = "https://api-takumi.mihoyo.com/post/wapi/getPostFull?gids=%s&post_id=%s&read=1";
const URL_FORUM_POST_DETAIL_APP = "https://api-takumi.mihoyo.com/post/api/getPostFull?post_id=%s";
const URL_FORUM_POST_UPVOTE = "https://api-takumi.mihoyo.com/apihub/api/upvotePost";
const URL_FORUM_POST_ACCESS = "https://api-community.mihoyo.com/community/forum/post/assessPost";
const URL_FORUM_POST_SHARE = "https://api-takumi.mihoyo.com/apihub/api/getShareConf?entity_id=%s&entity_type=1";

const FORUM_MAP = [
  {
    id: "1",
    forumId: "1",
    name: "崩坏3",
    url: "https://bbs.mihoyo.com/bh3/"
  },
  {
    id: "2",
    forumId: "26",
    name: "原神",
    url: "https://bbs.mihoyo.com/ys/"
  },
  {
    id: "3",
    forumId: "30",
    name: "崩坏2",
    url: "https://bbs.mihoyo.com/bh2/"
  },
  // {
  //   id: "4",
  //   name: "未定事件簿",
  //   url: "https://bbs.mihoyo.com/wd/"
  // },
  // {
  //   id: "5",
  //   name: "大别野",
  //   url: "https://bbs.mihoyo.com/dby/"
  // }
]

class MihoyoClient {
  constructor() {
    return (async () => {
      // await this.getCookies(loginTicket);
      if (_.isEmpty(process.env.COOKIE_STRING)) {
        console.error("环境变量 COOKIE_STRING 未配置，退出...");
        process.exit();
      }

      console.log(`cookie: ${process.env.COOKIE_STRING}`);
      this.cookieData = JSON.parse(process.env.COOKIE_STRING);

      await this.checkCookies();
      return this;
    })();
  }

  async getCookies(loginTicket) {
    // Step1
    let res = await superagent.get(util.format(URL_LOGIN_TICKET, loginTicket)).timeout(10000);
    // console.log(res.text);
    let resData = JSON.parse(res.text);
    let cookieInfo = {};
    if (resData.data.msg === "成功") {
      cookieInfo = resData.data["cookie_info"];
      console.log("Login success, cookie_token: %s", cookieInfo["cookie_token"]);
    } else {
      console.error("Login failed, %s", resData.data.msg);
      return;
    }

    // Step2
    res = await superagent
      .get(URL_QUERY_SIGN_IN_STATUS)
      .set("Cookie", `account_id=${cookieInfo["account_id"]}; cookie_token=${cookieInfo["cookie_token"]}`)
      .timeout(10000);
    resData = JSON.parse(res.text);

    // Append ltoken and luid
    let cookieData = parseCookie(res.header['set-cookie']);

    // Step3
    res = await superagent
      .get(util.format(URL_GET_MULTI_TOKEN, loginTicket, cookieInfo["account_id"]))
      .timeout(10000);
    resData = JSON.parse(res.text);

    // Append token
    cookieData.stoken = resData.data.list[0].token;
    cookieData.stuid = cookieData.ltuid;
    this.cookieData = cookieData;
    console.log(cookieData);
  }

  async checkCookies() {
    // Step2
    let res = await superagent
      .get(URL_QUERY_SIGN_IN_STATUS)
      .set("Cookie", stringifyCookie(this.cookieData))
      .timeout(10000);
    let resData = JSON.parse(res.text);
    console.log(res.text);
  }

  async signInForum() {
    let header = getHeader(this.cookieData);

    console.log(header);

    _.each(FORUM_MAP, async (forum) => {
      header['Referer'] = forum.url;
      let signData = {'gids': forum.id};
      let res = await superagent.post(URL_FORUM_SIGN_IN)
        .set(header)
        .send(JSON.stringify(signData));
      
      let resObj = JSON.parse(res.text);
      console.log(res.text);
      console.log("签到【%s】 %s", forum.name, resObj.message);
    });
  }

  async readForumPosts() {
    let header = getHeader(this.cookieData);
    header['Referer'] = "https://app.mihoyo.com/";

    for (let i=0; i<FORUM_MAP.length; i++) {
      let forum = FORUM_MAP[i];
      // 获取列表
      let res = await superagent.get(util.format(URL_FORUM_POST_LIST, forum.forumId));
      let resObj = JSON.parse(res.text);

      let postList = resObj.data.list;

      for (let i=0; i<postList.length; i++) {
        let post = postList[i];
        let postId = post['post_id'];

        console.log("读取帖子【%s】【%s】", postId, post.subject);

        // App 看帖
        res = await superagent
          .get(util.format(URL_FORUM_POST_DETAIL_APP, postId))
          .set(header);
        resObj = JSON.parse(res.text);
        console.log("看帖【%s】%s", postId, resObj.message);

        // App 点赞
        let upvotePostData = {
          "post_id": postId,
          "is_cancel": false
        }
        res = await superagent
          .post(URL_FORUM_POST_UPVOTE)
          .send(JSON.stringify(upvotePostData))
          .set(header);
        resObj = JSON.parse(res.text);
        console.log("点赞【%s】%s", postId, resObj.message);
      };
      
      // Share last post
      let sharePostId = postList[postList.length - 1]["post_id"];
      await this.share(sharePostId);
    };
  }

  async share(postId) {
    let header = getHeader(this.cookieData);
    header['Referer'] = "https://app.mihoyo.com";
    
    let res = await superagent
      .get(util.format(URL_FORUM_POST_SHARE, postId))
      .set(header);
    let resObj = JSON.parse(res.text);

    console.log("分享【%s】%s", postId, resObj.message);
  }
}

const parseCookie = (cookies) => {
  let cookieObj = {};
  _.each(cookies, (cookieStr) => {
    cookieStr = _.split(cookieStr, ";")[0];
    Object.assign(cookieObj, cookie.parse(cookieStr));
  });

  return cookieObj;
}

const stringifyCookie = (obj) => {
  let cookieStr = "";
  _.each(obj, (value, key) => {
    cookieStr += key + "=" + value + ";";
  })
  return cookieStr;
}

const getHeader = (cookieData) => {
  let randomStr = randomString(6);
  let timestamp = Math.floor(Date.now() / 1000)
  let appVersion = "2.1.0";

  // web sign
  // let sign = md5(`salt=${md5(appVersion)}&t=${timestamp}&r=${randomStr}`)

  // iOS sign
  let sign = md5(`salt=b253c83ab2609b1b600eddfe974df47b&t=${timestamp}&r=${randomStr}`);

  // Android sign
  // let sign1 = md5(`salt=b253c83ab2609b1b600eddfe974df47b&t=${timestamp}&r=${randomStr}`);
  // let sign2 = md5(`d7d38ba4719a2dfc6ec10c956733a8f4com.mihoyo.hyperion2.1.0${timestamp}`);

  // console.log(`salt=b253c83ab2609b1b600eddfe974df47b&t=${timestamp}&r=${randomStr}`);
  // console.log(`d7d38ba4719a2dfc6ec10c956733a8f4com.mihoyo.hyperion2.1.0${timestamp}`);
  // console.log(`${timestamp},${randomStr},${sign1},${sign2}`);
  // 1602476146,jj0n79,390e6b62002cf16f20bec30de5c28c2c,cc73a67900acb36da93bc4494014e3a4

  return {
    'Cookie': stringifyCookie(cookieData),
    'Content-Type': 'application/json',
    'User-Agent': 'Hyperion/67 CFNetwork/1128.0.1 Darwin/19.6.0',
    'x-rpc-channel': 'appstore',
    'x-rpc-device_id': randomString(32).toUpperCase(),
    'x-rpc-app_version': `${appVersion}`,
    'x-rpc-device_model': 'iPhone11,8',
    'x-rpc-device_name': randomString(_.random(1, 10)),
    'x-rpc-client_type': '1', // 1 - iOS, 2 - Android, 4 - Web
    'DS': `${timestamp},${randomStr},${sign}`
    // 'DS': `1602569298,k0xfEh,07f4545f5d88eac59cb1257aef74a570`
  }
}

const randomString = (length) => {
  let randomStr = "";
  for (let i=0; i<length; i++) {
    randomStr += _.sample("abcdefghijklmnopqrstuvwxyz0123456789");
  }
  return randomStr;
}

module.exports = MihoyoClient;