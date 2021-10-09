import _ from 'lodash';
import logger from './logger';

const sleepAsync = async (sleepms: number): Promise<void> => {
  return new Promise((resolve, reject)=> {
    setTimeout(() => {
      resolve();
    }, sleepms)
  });
}

const randomSleepAsync = async (): Promise<void> => {
  let sleep = 2 * 1000 + _.random(3 * 1000);
  logger.debug(`Sleep: ${sleep} ms`);
  await sleepAsync(sleep);
}

const randomString = (length: number): string => {
  let randomStr = '';
  for (let i=0; i<length; i++) {
    randomStr += _.sample('abcdefghijklmnopqrstuvwxyz0123456789');
  }
  return randomStr;
}

export default {
  sleepAsync,
  randomSleepAsync,
  randomString
}