const path = require('path')

// amp 配置文件
module.exports = {
  appEntry: path.resolve('src/app.json'),
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {},
  alias: {},
  style: '.less',
  entryIncludes: [
    path.resolve('src/app.ts'),
    path.resolve('src/app.less'),
    path.resolve('src/app.json?asConfig&type=app'),
  ],
  webpack(config) {
    return config
  },
}
