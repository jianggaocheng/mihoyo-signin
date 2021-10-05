const _ = require('lodash');
const async = require('async');
const utils = require('./lib/utils');

const FORUM_MAP = require('./lib/mihoyo/forum-map');

const forumSignIn = require('./lib/mihoyo/forum-sign');
const forumPostList = require('./lib/mihoyo/forum-post-list');
const forumPostDetail = require('./lib/mihoyo/forum-post-detail');
const forumPostVote = require('./lib/mihoyo/forum-post-vote');
const forumPostShare = require('./lib/mihoyo/forum-post-share');

// Init
require('./lib/global').init();

const init = async function() {
  // Sign In
  await async.eachSeries(FORUM_MAP, async (forum) => {
    await forumSignIn(forum);
    await utils.randomSleepAsync();
  });

  // Read, vote, share
  await async.eachSeries(FORUM_MAP, async (forum) => {
    let postList = await forumPostList(forum);
    await utils.randomSleepAsync();

    await async.eachSeries(postList, async ({post}) => {
      try {
        await forumPostDetail(post);

        await utils.randomSleepAsync();
  
        await forumPostVote(post);
  
        await utils.randomSleepAsync();
      } catch (e) {
        console.error("请求失败", e);
      }
    });

    let sharePost = postList[postList.length - 1];
    await forumPostShare(sharePost.post);
  });
};

init();
