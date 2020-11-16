const superagent = require('superagent');
const util = require('util');

const URL = "https://api-takumi.mihoyo.com/apihub/sapi/signIn?gids=%s";

module.exports = async (forum) => {
  let header = getHeader();

  let res = await superagent.post(util.format(URL, forum.id))
  .set(getHeader());

  let resObj = JSON.parse(res.text);
  console.log(res.text);
  console.log("签到【%s】 %s", forum.name, resObj.message);
}