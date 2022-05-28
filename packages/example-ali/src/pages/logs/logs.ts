import { setupPage, usePageLifeCycle } from '@goldfishjs/core'
import { formatTime } from '../../utils/util'

Page(
  setupPage(() => {
    usePageLifeCycle('onShow', () => {
      console.log('logs', formatTime(new Date()))
    })

    return {}
  })
)
