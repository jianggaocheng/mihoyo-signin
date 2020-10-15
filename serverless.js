const MihoyoClient = require("./lib/mihoyoClient");

const init = async function() {
  let mihoyoClient = await new MihoyoClient();
  await mihoyoClient.signInForum();
  await mihoyoClient.readForumPosts();
};

exports.handler = async (event, context, callback) => {
  await init();
}