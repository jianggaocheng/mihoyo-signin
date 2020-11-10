const sleepAsync = async (sleepms) => {
  return new Promise((resolve, reject)=> {
    setTimeout(() => {
      resolve();
    }, sleepms)
  });
}

module.exports = {
  sleepAsync
}