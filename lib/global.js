const _ = require('lodash');
const utils = require('./utils');
const md5 = require('md5');

const APP_VERSION = "2.2.0";
const DEVICE_ID = utils.randomString(32).toUpperCase();
const DEVICE_NAME = utils.randomString(_.random(1, 10));

const init = () => {
  if (_.isEmpty(process.env.COOKIE_STRING)) {
    console.error("环境变量 COOKIE_STRING 未配置，退出...");
    process.exit();
  };

  console.log(`DEVICE_ID: ${DEVICE_ID}, DEVICE_NAME: ${DEVICE_NAME}`);

  global.getHeader = () => {
    let randomStr = utils.randomString(6);
    let timestamp = Math.floor(Date.now() / 1000)
  
    // iOS sign
    let sign = md5(`salt=b253c83ab2609b1b600eddfe974df47b&t=${timestamp}&r=${randomStr}`);

    return {
      'Cookie': process.env.COOKIE_STRING,
      'Content-Type': 'application/json',
      'User-Agent': 'Hyperion/67 CFNetwork/1128.0.1 Darwin/19.6.0',
      'Referer': 'https://app.mihoyo.com',
      'x-rpc-channel': 'appstore',
      'x-rpc-device_id': DEVICE_ID,
      'x-rpc-app_version': APP_VERSION,
      'x-rpc-device_model': 'iPhone11,8',
      'x-rpc-device_name': DEVICE_NAME,
      'x-rpc-client_type': '1', // 1 - iOS, 2 - Android, 4 - Web
      'DS': `${timestamp},${randomStr},${sign}`
      // 'DS': `1602569298,k0xfEh,07f4545f5d88eac59cb1257aef74a570`
    }
  }
}

module.exports = {
  init
}