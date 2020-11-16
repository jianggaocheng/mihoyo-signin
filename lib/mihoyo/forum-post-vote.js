const superagent = require('superagent');
const util = require('util');

const URL = "https://api-takumi.mihoyo.com/apihub/sapi/upvotePost";

module.exports = async (post) => {
  let postId = post['post_id'];

  let upvotePostData = {
    "post_id": postId,
    "is_cancel": false
  }
  let res = await superagent
    .post(URL)
    .send(JSON.stringify(upvotePostData))
    .set(getHeader());
  resObj = JSON.parse(res.text);
  console.log("点赞【%s %s】%s", postId, post.subject, resObj.message);
}