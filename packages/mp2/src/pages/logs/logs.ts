import './logs.less'

Page({
  data: {
    logs: []
  },
  onLoad() {
    console.log('加载', this.data.logs);
  }
})
