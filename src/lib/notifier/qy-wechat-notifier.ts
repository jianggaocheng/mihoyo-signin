import superagent from 'superagent';
import logger from '../logger';
import { NotifierInterface } from './notifier';

export default class QyWechatNotifier implements NotifierInterface {
  webHook: string;

  constructor(webHook: string) {
    this.webHook = webHook;
  }

  async sendMarkdown(message: string): Promise<void> {
    if (!message) {
      message = '';
    }

    const form = {
      msgtype: 'markdown',
      markdown: {
        content: message
      }
    };

    logger.debug(`Send push ${JSON.stringify(form)}`);

    let pushResult: any = await superagent
      .post(this.webHook)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(form));

      pushResult = JSON.parse(pushResult.text);
      if (pushResult.errcode != 0) {
        logger.error(`Push failed: code [${pushResult.errcode}]  message [${pushResult.errmsg}]`);
      } else {
        logger.debug(`Push failed: code [${pushResult.errcode}]  message [${pushResult.errmsg}]`);
      }
  }
}