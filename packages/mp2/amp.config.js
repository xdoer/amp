const path = require('path')

// amp 配置文件
module.exports = {
  appEntry: path.resolve('src/app.ts'),
  sourceRoot: 'src',
  outputRoot: 'dist',
  defineConstants: {},
  alias: {},
  extensions: ['.ts'],
  webpack(config) {
    return config
  },
}
