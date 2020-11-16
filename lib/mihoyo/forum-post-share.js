const superagent = require('superagent');
const util = require('util');

const URL = "https://api-takumi.mihoyo.com/apihub/api/getShareConf?entity_id=%s&entity_type=1";

module.exports = async (post) => {
  let postId = post['post_id'];

  let res = await superagent.get(util.format(URL, postId)).set(getHeader());
  let resObj = JSON.parse(res.text);
  console.log("分享【%s %s】%s", postId, post.subject, resObj.message);
}