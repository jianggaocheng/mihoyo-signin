const superagent = require('superagent');
const util = require('util');

const URL = "https://api-takumi.mihoyo.com/post/api/getForumPostList?forum_id=%s&is_good=false&is_hot=false&page_size=20&sort_type=1";

module.exports = async (forum) => {
  let header = getHeader();

  let res = await superagent.get(util.format(URL, forum.forumId)).set(getHeader());
  let resObj = JSON.parse(res.text);
  let postList = resObj.data.list;

  return postList;
}