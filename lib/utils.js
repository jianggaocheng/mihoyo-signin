const _ = require('lodash');

const sleepAsync = async (sleepms) => {
  return new Promise((resolve, reject)=> {
    setTimeout(() => {
      resolve();
    }, sleepms)
  });
}

const randomSleepAsync = async () => {
  let sleep = 2 * 1000 + _.random(3 * 1000);
  console.debug("Sleep: %s ms", sleep);
  await sleepAsync(sleep);
}

const randomString = (length) => {
  let randomStr = "";
  for (let i=0; i<length; i++) {
    randomStr += _.sample("abcdefghijklmnopqrstuvwxyz0123456789");
  }
  return randomStr;
}

module.exports = {
  sleepAsync,
  randomSleepAsync,
  randomString
}