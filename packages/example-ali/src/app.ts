import { setupApp, useAppLifeCycle } from '@goldfishjs/core';
import { formatTime } from '@/utils/util'

App(
  setupApp(() => {
    useAppLifeCycle('onLaunch', () => {
      console.log('哈哈哈哈哈哈哈哈哈哈哈哈和', formatTime(new Date()))
    });
    return {};
  })
);