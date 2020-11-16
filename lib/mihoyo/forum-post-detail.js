const superagent = require('superagent');
const util = require('util');

const URL = "https://api-takumi.mihoyo.com/post/api/getPostFull?post_id=%s";

module.exports = async (post) => {
  let postId = post['post_id'];

  let res = await superagent.get(util.format(URL, postId)).set(getHeader());
  let resObj = JSON.parse(res.text);
  
  console.log("看帖【%s %s】%s", postId, post.subject, resObj.message);
}